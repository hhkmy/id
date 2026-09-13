#!/usr/bin/env bash

set -euo pipefail

LOCAL_DIR="${HOME}/.local"
PACKAGE_LOCK="package-lock.json"
TZ=Asia/Yangon
HUGO_CACHEDIR="${PWD}/.cache/hugo"
HTTPS_PROTO='=https'
BUILD_MODE="build"
if [[ "${1:-}" == "--serve" ]]; then
	BUILD_MODE="serve"
	shift
fi

cleanup() {
	if [[ -n "${build_temp_dir:-}" && -d "${build_temp_dir}" ]]; then
		rm -rf "${build_temp_dir}"
	fi
	return 0
}

trap cleanup EXIT SIGINT SIGTERM

latest_hugo_version() {
	local latest_release_url

	latest_release_url=$(curl --proto "${HTTPS_PROTO}" --proto-redir "${HTTPS_PROTO}" -fsSLI -o /dev/null -w "%{url_effective}" "https://github.com/gohugoio/hugo/releases/latest")
	printf "%s\n" "${latest_release_url##*/v}"
	return 0
}

is_compatible_node() {
	if command -v node >/dev/null 2>&1; then
		local current_node_version
		current_node_version=$(node -v)
		if [[ "${current_node_version}" =~ ^v(2[4-9]|[3-9][0-9])\. ]]; then
			return 0
		fi
	fi
	return 1
}

latest_node_version() {
	local resolved_version
	resolved_version=$(curl --proto "${HTTPS_PROTO}" --proto-redir "${HTTPS_PROTO}" -fsSL "https://nodejs.org/dist/latest-v24.x/" | grep -o 'node-v24\.[0-9]*\.[0-9]*-linux-x64\.tar\.gz' | head -n 1 | sed -e 's/node-v//' -e 's/-linux-x64\.tar\.gz//' || true)
	if [[ -z "${resolved_version}" ]]; then
		resolved_version="24.21.0"
	fi
	printf "%s\n" "${resolved_version}"
	return 0
}

main() {
	export TZ
	export HUGO_CACHEDIR
	unset npm_config_allow_scripts NPM_CONFIG_ALLOW_SCRIPTS npm_config_global_ignore_file NPM_CONFIG_GLOBAL_IGNORE_FILE

	build_temp_dir=$(mktemp -d)
	mkdir -p "${LOCAL_DIR}"

	if [[ ! -x "${LOCAL_DIR}/hugo/hugo" ]]; then
		HUGO_VERSION=$(latest_hugo_version)
		echo "Installing Hugo ${HUGO_VERSION}..."
		curl --proto "${HTTPS_PROTO}" --proto-redir "${HTTPS_PROTO}" -sfL --output-dir "${build_temp_dir}" -O "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
		mkdir -p "${LOCAL_DIR}/hugo"
		tar -C "${LOCAL_DIR}/hugo" -xf "${build_temp_dir}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
	fi
	export PATH="${LOCAL_DIR}/hugo:${PATH}"

	if [[ -f "${PACKAGE_LOCK}" ]]; then
		if is_compatible_node; then
			echo "Using host Node.js $(node -v)..."
		else
			NODE_VERSION=$(latest_node_version)
			if [[ ! -x "${LOCAL_DIR}/node-v${NODE_VERSION}-linux-x64/bin/node" ]]; then
				echo "Installing Node.js ${NODE_VERSION}..."
				curl --proto "${HTTPS_PROTO}" --proto-redir "${HTTPS_PROTO}" -sfL --output-dir "${build_temp_dir}" -O "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz"
				tar -C "${LOCAL_DIR}" -xf "${build_temp_dir}/node-v${NODE_VERSION}-linux-x64.tar.gz"
			fi
			export PATH="${LOCAL_DIR}/node-v${NODE_VERSION}-linux-x64/bin:${PATH}"
		fi
	fi

	echo "Logging tool versions..."
	hugo version
	node --version
	npm --version

	echo "Configuring Git..."
	git config --global core.quotepath false

	if [[ $(git rev-parse --is-shallow-repository) == true ]]; then
		echo "Fetching full Git history..."
		git fetch --unshallow
	fi

	if [[ -f .gitmodules ]]; then
		echo "Initializing Git submodules..."
		git submodule update --init --recursive
	fi

	if [[ -f "${PACKAGE_LOCK}" ]]; then
		echo "Installing Node.js dependencies..."
		unset npm_config_allow_scripts NPM_CONFIG_ALLOW_SCRIPTS
		npm ci --ignore-scripts
	fi

	if [[ "${BUILD_MODE}" == "serve" ]]; then
		echo "Starting the local Hugo development server..."
		npm run watch:hugo -- "$@"
		return 0
	fi

	echo "Building the project..."
	npm run build -- "$@"
	npm run pagefind
	cp cloudflare/_redirects public/_redirects
	return 0
}

main "$@"

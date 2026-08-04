#!/usr/bin/env bash

set -euo pipefail

NODE_VERSION=24.18.1
TZ=Asia/Yangon
HUGO_CACHEDIR="${PWD}/.cache/hugo"
BUILD_MODE="build"
if [[ "${1:-}" == "--serve" ]]; then
	BUILD_MODE="serve"
	shift
fi

cleanup() {
	if [[ -n "${build_temp_dir:-}" && -d "${build_temp_dir}" ]]; then
		rm -rf "${build_temp_dir}"
	fi
}

trap cleanup EXIT SIGINT SIGTERM

latest_hugo_version() {
	local latest_release_url

	latest_release_url=$(curl --proto '=https' --proto-redir '=https' -fsSLI -o /dev/null -w "%{url_effective}" "https://github.com/gohugoio/hugo/releases/latest")
	printf "%s\n" "${latest_release_url##*/v}"
}

main() {
	export TZ
	export HUGO_CACHEDIR

	build_temp_dir=$(mktemp -d)
	mkdir -p "${HOME}/.local"

	HUGO_VERSION=$(latest_hugo_version)
	echo "Installing Hugo ${HUGO_VERSION}..."
	curl --proto '=https' --proto-redir '=https' -sfL --output-dir "${build_temp_dir}" -O "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
	mkdir -p "${HOME}/.local/hugo"
	tar -C "${HOME}/.local/hugo" -xf "${build_temp_dir}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
	export PATH="${HOME}/.local/hugo:${PATH}"

	if [[ -f "package-lock.json" ]]; then
		echo "Installing Node.js ${NODE_VERSION}..."
		curl --proto '=https' --proto-redir '=https' -sfL --output-dir "${build_temp_dir}" -O "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz"
		tar -C "${HOME}/.local" -xf "${build_temp_dir}/node-v${NODE_VERSION}-linux-x64.tar.gz"
		export PATH="${HOME}/.local/node-v${NODE_VERSION}-linux-x64/bin:${PATH}"
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

	if [[ -f package-lock.json ]]; then
		echo "Installing Node.js dependencies..."
		unset npm_config_allow_scripts NPM_CONFIG_ALLOW_SCRIPTS
		npm ci
	fi

	if [[ "${BUILD_MODE}" == "serve" ]]; then
		echo "Starting the local Hugo development server..."
		npm run watch:hugo -- "$@"
		return
	fi

	echo "Building the project..."
	npm run build -- "$@"
	npm run pagefind
	cp cloudflare/_redirects public/_redirects
}

main "$@"

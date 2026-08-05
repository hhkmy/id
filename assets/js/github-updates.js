const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const dateHeading = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const svgNamespace = "http://www.w3.org/2000/svg";

const createCommitIcon = () => {
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.classList.add("octicon", "octicon-git-commit");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute(
    "d",
    "M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z",
  );
  svg.append(path);

  return svg;
};

const formatRelativeDate = (value) => {
  const date = new Date(value);
  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(elapsedSeconds) >= seconds) {
      return relativeTime.format(Math.round(elapsedSeconds / seconds), unit);
    }
  }

  return "just now";
};

const createCommitItem = (entry) => {
  const item = document.createElement("li");
  item.className = "github-commit-row";

  const body = document.createElement("div");
  body.className = "github-commit-body";

  const link = document.createElement("a");
  link.className = "github-commit-title";
  link.href = entry.html_url;
  link.textContent = entry.commit.message.split("\n", 1)[0];

  const meta = document.createElement("div");
  meta.className = "github-commit-meta";

  const author = entry.author?.login || entry.commit.author?.name || "Unknown";
  const dateValue = entry.commit.author?.date;
  const shortSha = entry.sha.slice(0, 7);

  if (entry.author?.avatar_url) {
    const avatar = document.createElement("img");
    avatar.className = "github-commit-avatar";
    avatar.src = `${entry.author.avatar_url}&size=40`;
    avatar.alt = "";
    avatar.width = 20;
    avatar.height = 20;
    avatar.loading = "lazy";
    meta.append(avatar);
  }

  const time = document.createElement("time");
  time.dateTime = dateValue;
  time.textContent = formatRelativeDate(dateValue);
  time.title = new Date(dateValue).toLocaleString("en", {
    dateStyle: "long",
    timeStyle: "short",
  });

  meta.append(`${author} committed `, time);
  body.append(link, meta);

  const actions = document.createElement("div");
  actions.className = "github-commit-actions";

  if (entry.commit.verification?.verified) {
    const verified = document.createElement("span");
    verified.className = "github-commit-verified";
    verified.textContent = "Verified";
    actions.append(verified);
  }

  const shaLink = document.createElement("a");
  shaLink.className = "github-commit-sha";
  shaLink.href = entry.html_url;
  shaLink.textContent = shortSha;
  shaLink.setAttribute("aria-label", `View commit ${shortSha}`);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "github-commit-copy";
  copyButton.dataset.clipboardText = entry.sha;
  copyButton.textContent = "Copy";
  copyButton.setAttribute("aria-label", `Copy commit hash ${entry.sha}`);

  const browseLink = document.createElement("a");
  browseLink.className = "github-commit-browse";
  browseLink.href = `https://github.com/hhkmy/id/tree/${entry.sha}`;
  browseLink.textContent = "<>";
  browseLink.title = "Browse the repository at this commit";
  browseLink.setAttribute(
    "aria-label",
    `Browse repository at commit ${shortSha}`,
  );

  actions.append(shaLink, copyButton, browseLink);
  item.append(body, actions);

  return item;
};

const createCommitGroup = (date, commits) => {
  const section = document.createElement("section");
  section.className = "github-commit-group";

  const heading = document.createElement("h3");
  heading.className = "github-commit-date";
  heading.append(
    createCommitIcon(),
    `Commits on ${dateHeading.format(new Date(date))}`,
  );

  const list = document.createElement("ol");
  list.className = "github-commit-list";
  commits.forEach((commit) => list.append(createCommitItem(commit)));
  section.append(heading, list);

  return section;
};

export const initGithubUpdates = async () => {
  const container = document.querySelector("#github-updates[data-endpoint]");
  if (!container) return;

  try {
    const response = await fetch(container.dataset.endpoint);
    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const commits = await response.json();
    if (!Array.isArray(commits) || commits.length === 0) {
      throw new Error("GitHub returned no commits");
    }

    const groups = new Map();
    commits.forEach((commit) => {
      const date = commit.commit.author.date.slice(0, 10);
      const group = groups.get(date) || [];
      group.push(commit);
      groups.set(date, group);
    });

    const timeline = document.createElement("div");
    timeline.className = "github-commit-timeline";
    groups.forEach((group, date) =>
      timeline.append(createCommitGroup(date, group)),
    );
    container.replaceChildren(timeline);
  } catch (error) {
    console.error("Unable to load GitHub updates:", error);
    const status = document.createElement("p");
    status.className = "github-updates-status";
    status.textContent = "The latest commits could not be loaded right now.";
    container.replaceChildren(status);
  } finally {
    container.setAttribute("aria-busy", "false");
  }
};

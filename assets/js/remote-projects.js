function get_tools(repoName, owner) {
  fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/topics`, {
    headers: { Accept: "application/vnd.github+json" }
  })
    .then(response => response.ok ? response.json() : Promise.reject(response.status))
    .then(data => {
      const parent = document.getElementById(`${repoName}-tools`);
      if (!parent) return;
      data.names.forEach(tool => {
        const badge = document.createElement("span");
        badge.textContent = tool;
        badge.className = "badge badge-pill text-primary border border-primary";
        parent.append(badge, " ");
      });
    })
    .catch(() => {});
}

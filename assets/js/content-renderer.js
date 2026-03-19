export function resolvePath(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('mailto')) return path;
  return path;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function renderParagraphs(paragraphs) {
  if (!Array.isArray(paragraphs) || !paragraphs.length) return '';
  return paragraphs
    .map((text) => String(text || '').trim())
    .filter(Boolean)
    .map((text) => `<p>${escapeHtml(text)}</p>`)
    .join('');
}

function renderHighlights(highlightsTitle, highlights) {
  if (!Array.isArray(highlights) || !highlights.length) return '';
  const title = highlightsTitle ? `<p><strong>${escapeHtml(highlightsTitle)}</strong></p>` : '';
  const items = highlights
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  return `${title}<ul>${items}</ul>`;
}

function renderLinks(links) {
  if (!Array.isArray(links) || !links.length) return '';
  return links
    .map((link) => {
      if (!link || typeof link !== 'object' || !link.url) return '';
      const prefix = link.prefix ? `${escapeHtml(link.prefix)} ` : '';
      const label = escapeHtml(link.label || link.text || link.url);
      const url = escapeAttr(link.url);
      return `<p>${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
    })
    .join('');
}

function renderLegacyDetails(item, fallbackText) {
  const legacyHtml = item.fullDesc || item.detailsBody;
  if (legacyHtml) return legacyHtml;
  if (item.desc) return `<p>${escapeHtml(item.desc)}</p>`;
  if (fallbackText) return `<p>${escapeHtml(fallbackText)}</p>`;
  return '';
}

export function renderDetailsBlock(item, options = {}) {
  const fallbackText = options.fallbackText || '';

  if (!item || typeof item !== 'object') {
    return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : '';
  }

  const details = item.details;

  if (details === null || details === undefined || details === '') {
    return renderLegacyDetails(item, fallbackText);
  }

  if (typeof details === 'string') {
    return `<p>${escapeHtml(details)}</p>`;
  }

  if (Array.isArray(details)) {
    return renderParagraphs(details) || renderLegacyDetails(item, fallbackText);
  }

  if (typeof details !== 'object') {
    return renderLegacyDetails(item, fallbackText);
  }

  const paragraphs = Array.isArray(details.paragraphs)
    ? details.paragraphs
    : details.paragraph
      ? [details.paragraph]
      : [];

  const parts = [
    renderParagraphs(paragraphs),
    renderHighlights(details.highlightsTitle, details.highlights),
    renderLinks(details.links),
    typeof details.rawHtml === 'string' ? details.rawHtml : ''
  ].filter(Boolean);

  if (!parts.length) {
    return renderLegacyDetails(item, fallbackText);
  }

  return parts.join('');
}

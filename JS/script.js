// Lightweight API helper for this project
const API = (() => {
	let baseUrl = '';

	function setBaseUrl(url) {
		baseUrl = url.replace(/\/$/, '');
		localStorage.setItem('api_base_url', baseUrl);
	}

	function getBaseUrl() {
		return baseUrl || localStorage.getItem('api_base_url') || '';
	}

	function getToken() {
		return localStorage.getItem('api_token');
	}

	function setToken(token) {
		if (token) localStorage.setItem('api_token', token);
	}

	function removeToken() {
		localStorage.removeItem('api_token');
	}

	function setAffiliateId(id) {
		if (id) localStorage.setItem('affiliate_id', id);
	}

	function getAffiliateId() {
		return localStorage.getItem('affiliate_id');
	}

	async function apiFetch(path, opts = {}) {
		const base = getBaseUrl();
		const url = path.match(/^https?:\/\//) ? path : `${base}/${path.replace(/^\//, '')}`;

		const headers = new Headers(opts.headers || {});
		if (!headers.has('Content-Type') && !(opts.body instanceof FormData)) {
			headers.set('Content-Type', 'application/json');
		}

		const token = getToken();
		if (token) headers.set('Authorization', `Bearer ${token}`);

		const aff = getAffiliateId();
		if (aff) headers.set('X-Affiliate-Id', String(aff));

		const res = await fetch(url, { ...opts, headers });

		const text = await res.text();
		const contentType = res.headers.get('Content-Type') || '';
		const body = contentType.includes('application/json') && text ? JSON.parse(text) : text;

		if (!res.ok) {
			const err = new Error(body && body.message ? body.message : res.statusText || 'Request failed');
			err.status = res.status;
			err.body = body;
			throw err;
		}

		return body;
	}

	// For APIs that require POSTed search (Booking Demand API uses POST /accommodations/search)
	async function searchAccommodations(payload, path = '/accommodations/search') {
		return apiFetch(path, {
			method: 'POST',
			body: JSON.stringify(payload),
		});
	}

	// Convenience: fetch generic GET resources
	async function get(path) {
		return apiFetch(path, { method: 'GET' });
	}

	return {
		setBaseUrl,
		getBaseUrl,
		getToken,
		setToken,
		removeToken,
		setAffiliateId,
		getAffiliateId,
		apiFetch,
		searchAccommodations,
		get,
	};
})();

/* Notes:
 - This helper stores `api_base_url`, `affiliate_id`, and `api_token` in localStorage for convenience.
 - For production, prefer a more secure token storage and refresh flows.
 - Use `API.searchAccommodations(payload)` to call `/accommodations/search` (see OpenAPI spec).
*/

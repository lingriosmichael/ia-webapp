globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/ActivityTabs-CDwt0F6F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e0-aIZ6Ysfq+h58pqf/0GpYf00SdOc\"",
		"mtime": "2026-07-02T09:00:04.679Z",
		"size": 1504,
		"path": "../public/assets/ActivityTabs-CDwt0F6F.js"
	},
	"/assets/LanguageSwitcher-DDlj8jf1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e4-5BpzGNnKRT3+cooxahavajKsfhM\"",
		"mtime": "2026-07-02T09:00:04.679Z",
		"size": 1252,
		"path": "../public/assets/LanguageSwitcher-DDlj8jf1.js"
	},
	"/assets/OrganizationSettingsPanel-RxIxiTRm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177d-M3YDd2IoBSfsDRA2U4z0cxWmVEM\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 6013,
		"path": "../public/assets/OrganizationSettingsPanel-RxIxiTRm.js"
	},
	"/assets/PublicMarketingShell-BVq6mQVz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4dc-tORRcEzlY8xvP2H60GGvj0Bj5uk\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 1244,
		"path": "../public/assets/PublicMarketingShell-BVq6mQVz.js"
	},
	"/assets/PublicSiteHeader-Jc50_u1h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45a-B/29F10xrAKo4dsB1waqOlWtLSw\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 1114,
		"path": "../public/assets/PublicSiteHeader-Jc50_u1h.js"
	},
	"/assets/_projectId-CWixSmUI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b01-slThWMi6NF5XbZrN045RsjUB19M\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 11009,
		"path": "../public/assets/_projectId-CWixSmUI.js"
	},
	"/assets/_organizationId-nwueJY3w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c0e-9gIlsVZLEr2Mume1H0pswDOmFzU\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 7182,
		"path": "../public/assets/_organizationId-nwueJY3w.js"
	},
	"/assets/activities-Bb7hBfSi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67b-vTrfMr5eiCxS0dIl2Xgwf7MpoNg\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 1659,
		"path": "../public/assets/activities-Bb7hBfSi.js"
	},
	"/assets/WorkspaceShell-BjI82mvc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2156e-YCp/XVW49EVKYc3bnubWYrg5ah8\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 136558,
		"path": "../public/assets/WorkspaceShell-BjI82mvc.js"
	},
	"/assets/analysis-B5UgKkCT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1761-EUh3EO0I+w/4Zk+GkLBePBwecug\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 5985,
		"path": "../public/assets/analysis-B5UgKkCT.js"
	},
	"/assets/analytics-DQ-LbZRy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-QJzJKLvHu58Zhp7ME0aLdS2xQWI\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 534,
		"path": "../public/assets/analytics-DQ-LbZRy.js"
	},
	"/assets/arrow-right-Ct_7n9bo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-f1pRCx47YkGS+AL0yCbvxN3X4BY\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 154,
		"path": "../public/assets/arrow-right-Ct_7n9bo.js"
	},
	"/assets/billing-DwfA0Cby.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3dd-l7VwLx/Xu807I671Ngvhe1qjB0o\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 989,
		"path": "../public/assets/billing-DwfA0Cby.js"
	},
	"/assets/brief-B1WCsa4J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-/pImRUhR+ie9vhE6Xz4oq8k69Cc\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 534,
		"path": "../public/assets/brief-B1WCsa4J.js"
	},
	"/assets/building-2-BW4Fpb5A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-BBepsbJdUp1VqKBpktm/hVBbxlE\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 372,
		"path": "../public/assets/building-2-BW4Fpb5A.js"
	},
	"/assets/chevron-right-DL_r_jCs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-1usDAVu6n8XWefcbTdPsw0yBKdk\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 320,
		"path": "../public/assets/chevron-right-DL_r_jCs.js"
	},
	"/assets/button-CxCnhumT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53a-ARmyCxFPswsznEZWBXh5BGLUoOI\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 1338,
		"path": "../public/assets/button-CxCnhumT.js"
	},
	"/assets/circle-alert-BmhQHMZ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-YTe/feoCmbf1uAY8wCYIIJ7hE+4\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 239,
		"path": "../public/assets/circle-alert-BmhQHMZ5.js"
	},
	"/assets/circle-check-C_cGsJzP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-DTBWEuKU1WguZ+pnx2T8kACHEBA\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 167,
		"path": "../public/assets/circle-check-C_cGsJzP.js"
	},
	"/assets/clock-3-B3Li7E9v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e-SW+xdJC+IC22XUG1iJf6pnowTQ4\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 158,
		"path": "../public/assets/clock-3-B3Li7E9v.js"
	},
	"/assets/cloud-upload-2WKD_C-A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0-fdbTRox91XmtG/s9SyROH/aWAC8\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 240,
		"path": "../public/assets/cloud-upload-2WKD_C-A.js"
	},
	"/assets/data-review-BxJKqcKk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4aa0-yGPXC5gCZ5jQlEwG6BDNL2jQY6c\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 19104,
		"path": "../public/assets/data-review-BxJKqcKk.js"
	},
	"/assets/database-Cg47RGnj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-YDvbyddCK2xFkZ1hOXoJ4yCUyaY\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 232,
		"path": "../public/assets/database-Cg47RGnj.js"
	},
	"/assets/analytics-DmjQ8t5a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67921-30WtANYzlmcyKHKQGeZVrN4Gn3U\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 424225,
		"path": "../public/assets/analytics-DmjQ8t5a.js"
	},
	"/assets/WorkspaceUI-DdTRU_H5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd4-MD9U62VkyenfP/xISMiZ8NaldRM\"",
		"mtime": "2026-07-02T09:00:04.680Z",
		"size": 3028,
		"path": "../public/assets/WorkspaceUI-DdTRU_H5.js"
	},
	"/assets/dist-DvUzowoS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7d-2pAIC2NHeqeWyEIMT6awet8Kqcc\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 2941,
		"path": "../public/assets/dist-DvUzowoS.js"
	},
	"/assets/folder-kanban-DtoK-M9b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"152-+LA71/kfG3NTUH2jYm06EWI00f4\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 338,
		"path": "../public/assets/folder-kanban-DtoK-M9b.js"
	},
	"/assets/index-Z2FyUWXG.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1682e-+glkxhO3gZSaf1kl4vaBciDU1dU\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 92206,
		"path": "../public/assets/index-Z2FyUWXG.css"
	},
	"/assets/input-DUl10sCT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"270-k99NaOzKIbVRRZY4Op96dcB5D1U\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 624,
		"path": "../public/assets/input-DUl10sCT.js"
	},
	"/assets/insights-Xt9RMpUM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1193-ohwoqZSANg+1oSUn7T6e/4CcMxw\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 4499,
		"path": "../public/assets/insights-Xt9RMpUM.js"
	},
	"/assets/file-spreadsheet-AUbm8BBk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a1-ZKN34BjydLCwJJoAMi2kXhljJcM\"",
		"mtime": "2026-07-02T09:00:04.681Z",
		"size": 417,
		"path": "../public/assets/file-spreadsheet-AUbm8BBk.js"
	},
	"/assets/invitations._token.accept-oTMYt9LK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ec-zTdNxY5lGqzKOy0SxMBkm9L6tYU\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 2284,
		"path": "../public/assets/invitations._token.accept-oTMYt9LK.js"
	},
	"/assets/layers-D5237lAG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a-JAKbx2C45rr8eoUSpNtymk1cgPw\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 410,
		"path": "../public/assets/layers-D5237lAG.js"
	},
	"/assets/insights-CpaksrUy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11f7-sKGVFBwz9x/K5YjkbHERJr8B6A4\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 4599,
		"path": "../public/assets/insights-CpaksrUy.js"
	},
	"/assets/layout-grid-CZVfhk2Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29b-+YIucPMHJwXMmadF6W80eCvc7Pg\"",
		"mtime": "2026-07-02T09:00:04.682Z",
		"size": 667,
		"path": "../public/assets/layout-grid-CZVfhk2Q.js"
	},
	"/assets/lightbulb-C7ESbGzr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113-OhbRRMxir+RVZAsn3Tw2g/tq55w\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 275,
		"path": "../public/assets/lightbulb-C7ESbGzr.js"
	},
	"/assets/login-PzJ7ktZ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"942-FkZ3EgAyO9SB3IhFT9+NkGWTWTI\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 2370,
		"path": "../public/assets/login-PzJ7ktZ_.js"
	},
	"/assets/members-BMJC77G2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fba-1jikjQihOWa2dULvWCptj8Cxnjo\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 4026,
		"path": "../public/assets/members-BMJC77G2.js"
	},
	"/assets/mock-data-qCKU7q8F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1488-oi4IZCIgyfiJygxtBX4nsPC1zBY\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 5256,
		"path": "../public/assets/mock-data-qCKU7q8F.js"
	},
	"/assets/onboarding.invite-C-XhujVq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97c-4GyiSIzuDWOzuYwDEYma0PK02ls\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 2428,
		"path": "../public/assets/onboarding.invite-C-XhujVq.js"
	},
	"/assets/onboarding.profile-gEanUikR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32b-QKIDHXehzo+YFsxBjeyhddowv9k\"",
		"mtime": "2026-07-02T09:00:04.683Z",
		"size": 811,
		"path": "../public/assets/onboarding.profile-gEanUikR.js"
	},
	"/assets/onboarding.welcome-B3H9n-IA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35e-xuatKEmZRN3PDDWQZJCp3zx7VU8\"",
		"mtime": "2026-07-02T09:00:04.684Z",
		"size": 862,
		"path": "../public/assets/onboarding.welcome-B3H9n-IA.js"
	},
	"/assets/onboarding.workspace-CCIR2TMA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6fb-K093eZWTtFYR8iZ34UCadzJkYtM\"",
		"mtime": "2026-07-02T09:00:04.684Z",
		"size": 1787,
		"path": "../public/assets/onboarding.workspace-CCIR2TMA.js"
	},
	"/assets/organization-branding-DBnYU2AD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99c-4PIqZ7SBFx8vrVdwis/daCQtBR4\"",
		"mtime": "2026-07-02T09:00:04.684Z",
		"size": 2460,
		"path": "../public/assets/organization-branding-DBnYU2AD.js"
	},
	"/assets/overview-ofQUWEFG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c39-fwA2y0Fs5TlcLEjGxoq/uw8AwrI\"",
		"mtime": "2026-07-02T09:00:04.685Z",
		"size": 15417,
		"path": "../public/assets/overview-ofQUWEFG.js"
	},
	"/assets/processing-BIvaMDUW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-iSZTBdqaW/Vih5Q4yB9s4HMU58o\"",
		"mtime": "2026-07-02T09:00:04.685Z",
		"size": 534,
		"path": "../public/assets/processing-BIvaMDUW.js"
	},
	"/assets/profile-CC51b1M6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3af-5gM6q4AcpaTVgU+sKlyJV52sqOA\"",
		"mtime": "2026-07-02T09:00:04.685Z",
		"size": 943,
		"path": "../public/assets/profile-CC51b1M6.js"
	},
	"/assets/projects-Be8bIDTg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bd-0M2hkYsplZk4F6bI495wEn7dDbc\"",
		"mtime": "2026-07-02T09:00:04.686Z",
		"size": 1725,
		"path": "../public/assets/projects-Be8bIDTg.js"
	},
	"/assets/index-DJeg1JMu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7df12-edAgncP5RgOA9ff8fJFnRVGjdSs\"",
		"mtime": "2026-07-02T09:00:04.679Z",
		"size": 515858,
		"path": "../public/assets/index-DJeg1JMu.js"
	},
	"/assets/register-C4qmQmNp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94c-Aqg8ERGZAcN5ek0xtkIDra620nQ\"",
		"mtime": "2026-07-02T09:00:04.686Z",
		"size": 2380,
		"path": "../public/assets/register-C4qmQmNp.js"
	},
	"/assets/route-DEjDTAN5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"662-i844wwxrU8HTWTB7AM+jtMySR0g\"",
		"mtime": "2026-07-02T09:00:04.686Z",
		"size": 1634,
		"path": "../public/assets/route-DEjDTAN5.js"
	},
	"/assets/route-DULf5k2i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ae-u+13AJVwV75yd3BfAz3+Cagnwdk\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 1710,
		"path": "../public/assets/route-DULf5k2i.js"
	},
	"/assets/schema-BaiVfpYy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"219-4NY/kKK+0DhEgT/2mT4BMtqT1l4\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 537,
		"path": "../public/assets/schema-BaiVfpYy.js"
	},
	"/assets/routes-vk8FiE7x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2e-kbxUzba4xE/2OPtE3+6ltZas7EE\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 3374,
		"path": "../public/assets/routes-vk8FiE7x.js"
	},
	"/assets/settings-2-DGtCHT0O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b7-SBoS9zhhsvsHbjOyt0zB7NJl+/I\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 439,
		"path": "../public/assets/settings-2-DGtCHT0O.js"
	},
	"/assets/settings-BFbXWFZ3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114a-8iI8tDd7P7773iw/85uqp+Vb4zE\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 4426,
		"path": "../public/assets/settings-BFbXWFZ3.js"
	},
	"/assets/settings-C5CWazLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40f-p5nq00GywI+BB44IeTwSLNfq3sA\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 1039,
		"path": "../public/assets/settings-C5CWazLN.js"
	},
	"/assets/settings-BpUfA6Ig.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1457-w5qtGSAXj1E5679WWKUgAa1mBSg\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 5207,
		"path": "../public/assets/settings-BpUfA6Ig.js"
	},
	"/assets/shield-check-BvKpxRDp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-87fP+zSZ76v9Dz9tisrO9XS0JSY\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 309,
		"path": "../public/assets/shield-check-BvKpxRDp.js"
	},
	"/assets/translation-utils-PFc-2Mcw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d2-uJvoQAFMF8CqUpuTwsfNpQhHddE\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 466,
		"path": "../public/assets/translation-utils-PFc-2Mcw.js"
	},
	"/assets/triangle-alert-1rvtl5OP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe-vD2fGACJzEHrD9Mpumxqg3x/3lk\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 254,
		"path": "../public/assets/triangle-alert-1rvtl5OP.js"
	},
	"/assets/sparkles-CF6f6ojp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-6uuJte24U4pmjcqSzuT6wjRD8Hg\"",
		"mtime": "2026-07-02T09:00:04.687Z",
		"size": 483,
		"path": "../public/assets/sparkles-CF6f6ojp.js"
	},
	"/assets/upload-tvbyOlqA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-OGESkTsnm9J2aLm+URiY8yV+vd4\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 534,
		"path": "../public/assets/upload-tvbyOlqA.js"
	},
	"/assets/use-grantready-Ci7VjeoY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2e-k4OzGLoK3GY0p1wGlbBLduH6CtI\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 3630,
		"path": "../public/assets/use-grantready-Ci7VjeoY.js"
	},
	"/assets/use-workspace-locale-BP9i2w8e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e68-2JY3/Yeni0zzsRoVp9ixTRxhXTs\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 20072,
		"path": "../public/assets/use-workspace-locale-BP9i2w8e.js"
	},
	"/assets/use-auth-GfQ8GlCB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d35-U1U4TqwhblQ5HE0Hf+i5S7JSXzE\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 15669,
		"path": "../public/assets/use-auth-GfQ8GlCB.js"
	},
	"/assets/utils-BO4J1lnh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f45-bM9Ay4fIxscC8lQ+jIlBUESXztA\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 28485,
		"path": "../public/assets/utils-BO4J1lnh.js"
	},
	"/assets/useTranslation-OeIRYpPg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c2e-JqzpwCzd+rA4YVCOF6j9T8fyKTg\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 39982,
		"path": "../public/assets/useTranslation-OeIRYpPg.js"
	},
	"/assets/x-BLmMc6HU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d6-EviDIw/hTRubkfZOAZ+EV8rD9lM\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 214,
		"path": "../public/assets/x-BLmMc6HU.js"
	},
	"/assets/workspace-routing-CxFfGTCm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69-oSX6hUSs5UKOD5CmTMKncnYWVBg\"",
		"mtime": "2026-07-02T09:00:04.688Z",
		"size": 105,
		"path": "../public/assets/workspace-routing-CxFfGTCm.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_lLtqN1 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_lLtqN1
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };

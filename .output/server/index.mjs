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
	"/assets/WorkspaceShell-Csw1h_K6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"248a9-E2gMy8atEYUJSWXAtgdtgqD1gZU\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 149673,
		"path": "../public/assets/WorkspaceShell-Csw1h_K6.js"
	},
	"/assets/analysis-BLxq-l5w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1761-m/W9D5cfxMdeF2vMnlW/JOeYwrI\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 5985,
		"path": "../public/assets/analysis-BLxq-l5w.js"
	},
	"/assets/analytics-DyrPK5z1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-QabiXuPu6nisaBuun8RctcMEuKk\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 534,
		"path": "../public/assets/analytics-DyrPK5z1.js"
	},
	"/assets/arrow-right-cF9r-7Ub.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-0M4QPIHjW3l9R4bcPzMYBXal84M\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 157,
		"path": "../public/assets/arrow-right-cF9r-7Ub.js"
	},
	"/assets/analytics-Dt133CSf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67900-aGv+2Da1fMp8K8DQQBRxYjs5S4Y\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 424192,
		"path": "../public/assets/analytics-Dt133CSf.js"
	},
	"/assets/LanguageSwitcher-C4LUSLgt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e7-1I1gnu8hMch3at2SNNkyyaEDz4c\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 1255,
		"path": "../public/assets/LanguageSwitcher-C4LUSLgt.js"
	},
	"/assets/ActivityTabs-CuqTKh1C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e3-OIrEn/KFUOXjAmDZQj1vJ4ZOBoM\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 1507,
		"path": "../public/assets/ActivityTabs-CuqTKh1C.js"
	},
	"/assets/circle-check-C6HVhs7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa-KS/dusVynojRygpbATVXqUNJLeU\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 170,
		"path": "../public/assets/circle-check-C6HVhs7U.js"
	},
	"/assets/clock-3-CZWSdsEr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1-tccAGpzNkyYERSt5SPmcHJiO1wg\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 161,
		"path": "../public/assets/clock-3-CZWSdsEr.js"
	},
	"/assets/cloud-upload-DMGv27sk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-gYu1vtOP0+YRw6eYI9q5TV8Ry0A\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 243,
		"path": "../public/assets/cloud-upload-DMGv27sk.js"
	},
	"/assets/circle-alert-uP4gYS-z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-obd7HllLtuAhjw7yvPYFhVVnHto\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 242,
		"path": "../public/assets/circle-alert-uP4gYS-z.js"
	},
	"/assets/database-wT4TQsj3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-YGAUhUNHGiBWxn+qanoJgPZtHmM\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 235,
		"path": "../public/assets/database-wT4TQsj3.js"
	},
	"/assets/file-spreadsheet-D98oYIFY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-6UBUwldihiGdkTpt458UE5sLgqM\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 420,
		"path": "../public/assets/file-spreadsheet-D98oYIFY.js"
	},
	"/assets/folder-kanban-C-iiWABY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155-HqMeybrtU28q3i0aFtaAzTh70iA\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 341,
		"path": "../public/assets/folder-kanban-C-iiWABY.js"
	},
	"/assets/brief-tu05Jz9z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-0hjk9UWL/V3Upr1C4P16tXkc8bM\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 534,
		"path": "../public/assets/brief-tu05Jz9z.js"
	},
	"/assets/data-review-BB4Y9tj9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a7f-1MzGI5iuNogDWYkefghwX+3Ef1k\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 19071,
		"path": "../public/assets/data-review-BB4Y9tj9.js"
	},
	"/assets/input-Cijinylu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120a-P4TRM+dMqB087jqSmiioZHDyn5I\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 4618,
		"path": "../public/assets/input-Cijinylu.js"
	},
	"/assets/insights-6iECHEA0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d6-UbYqG/KIiCU3VXwyvE5x5luiaXA\"",
		"mtime": "2026-07-01T22:40:07.910Z",
		"size": 4566,
		"path": "../public/assets/insights-6iECHEA0.js"
	},
	"/assets/insights-CYKXcquG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1193-Fw2U2Z3zRTT29YOQBcVdFW6l3mQ\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 4499,
		"path": "../public/assets/insights-CYKXcquG.js"
	},
	"/assets/layers-BSIy8VCY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19d-of9TflqR7ihHjqlRslhbVMvXiOY\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 413,
		"path": "../public/assets/layers-BSIy8VCY.js"
	},
	"/assets/layout-grid-Byttj9Tu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29e-puFK7RAOK0gmEdGhaxR+TWxcOLg\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 670,
		"path": "../public/assets/layout-grid-Byttj9Tu.js"
	},
	"/assets/_projectId-CPxb15xX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a71-9JzE5kJXYN80LKtlauAwNsV+hNs\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 10865,
		"path": "../public/assets/_projectId-CPxb15xX.js"
	},
	"/assets/index-DByEdR6C.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"163a7-hPyXGx/MOYLyxf51+omnUNiwTPw\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 91047,
		"path": "../public/assets/index-DByEdR6C.css"
	},
	"/assets/WorkspaceUI-xDqi-cG0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd8-tp7DbIz+nAtsL5I2QyXP8wF623g\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 3032,
		"path": "../public/assets/WorkspaceUI-xDqi-cG0.js"
	},
	"/assets/index-XMTQKGOF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b614-ad4iOTbNWicsPMuHpYFqVahbRo8\"",
		"mtime": "2026-07-01T22:40:07.909Z",
		"size": 505364,
		"path": "../public/assets/index-XMTQKGOF.js"
	},
	"/assets/lightbulb-B49Jxbf9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-VxiiRG+e5iXsiVGkFUehUPToTew\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 278,
		"path": "../public/assets/lightbulb-B49Jxbf9.js"
	},
	"/assets/login-BRV2Ihh4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db9-Hq0Lm0iQDq+qFxF+/CTEQENPSDc\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 3513,
		"path": "../public/assets/login-BRV2Ihh4.js"
	},
	"/assets/mock-data-qCKU7q8F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1488-oi4IZCIgyfiJygxtBX4nsPC1zBY\"",
		"mtime": "2026-07-01T22:40:07.911Z",
		"size": 5256,
		"path": "../public/assets/mock-data-qCKU7q8F.js"
	},
	"/assets/overview-BGt0UTgh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b83-GqaJ9tzKUT2xwjydjToiUP3G2hI\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 15235,
		"path": "../public/assets/overview-BGt0UTgh.js"
	},
	"/assets/processing-st5Sjmue.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-GdTkeWSL9tMsa5p1osqGi67Tr50\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 534,
		"path": "../public/assets/processing-st5Sjmue.js"
	},
	"/assets/register-B3sSD6os.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fc2-8U89gjO9Mir/w+9GloNJoJhK76E\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 4034,
		"path": "../public/assets/register-B3sSD6os.js"
	},
	"/assets/route-B0EnOjYn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c48-Y3zjVmC+1t3Eum1PIYxovd+toa0\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 7240,
		"path": "../public/assets/route-B0EnOjYn.js"
	},
	"/assets/route-CUsM4S8H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"435-u88nBCwomSMCWyWl331TZBP/YAk\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 1077,
		"path": "../public/assets/route-CUsM4S8H.js"
	},
	"/assets/routes-BncvCtWx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100c-P1kX+1hA7dyGNjxT6JTw7Nypuyc\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 4108,
		"path": "../public/assets/routes-BncvCtWx.js"
	},
	"/assets/schema-DtaDRdk0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"219-rGI5SI/gKHuHwOYKE3qlb6eP7po\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 537,
		"path": "../public/assets/schema-DtaDRdk0.js"
	},
	"/assets/settings-2-DZxop9fw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ba-ZiWNRwSwt9ObcyC+i+lW/35q9oA\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 442,
		"path": "../public/assets/settings-2-DZxop9fw.js"
	},
	"/assets/settings-C5PSn7D5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1129-IgmYY0l7e9EBnAtfHc08fFZWHnE\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 4393,
		"path": "../public/assets/settings-C5PSn7D5.js"
	},
	"/assets/settings-NNZkm2Ra.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e8-yvA2WMBHWgJdyKSRml1x9h6zk/g\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 5096,
		"path": "../public/assets/settings-NNZkm2Ra.js"
	},
	"/assets/shield-check-BmEG2Hxs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138-67uCvD8/86hyI8g6fdtWYwXDZBs\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 312,
		"path": "../public/assets/shield-check-BmEG2Hxs.js"
	},
	"/assets/sparkles-BaaXflIG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-cW9+mECPqOOpDDn9JNnClO9xMX4\"",
		"mtime": "2026-07-01T22:40:07.912Z",
		"size": 486,
		"path": "../public/assets/sparkles-BaaXflIG.js"
	},
	"/assets/translation-utils-PFc-2Mcw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d2-uJvoQAFMF8CqUpuTwsfNpQhHddE\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 466,
		"path": "../public/assets/translation-utils-PFc-2Mcw.js"
	},
	"/assets/triangle-alert-DqN6UidP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-jpVbKJAl+zu3N+Ws0tZ7NNlvP3c\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 257,
		"path": "../public/assets/triangle-alert-DqN6UidP.js"
	},
	"/assets/upload-DeZiBAi5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-lyOQ1zEduDmX++mVau31P4omaD4\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 534,
		"path": "../public/assets/upload-DeZiBAi5.js"
	},
	"/assets/use-auth-D3BwKFUv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a98d-ZatFvstO7bgDgYiTvnE9mbTYm7I\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 43405,
		"path": "../public/assets/use-auth-D3BwKFUv.js"
	},
	"/assets/use-grantready-U9kCN8h8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6c-q7lUm0EN+ddsBhIGUS9N9RSUrTg\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 2924,
		"path": "../public/assets/use-grantready-U9kCN8h8.js"
	},
	"/assets/useTranslation-BvuV913l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9baf-DCpdK2USN2budpVuYST76wayAwQ\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 39855,
		"path": "../public/assets/useTranslation-BvuV913l.js"
	},
	"/assets/workspace-routing-BVpUowaS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-CXQ3q3+enVC3XxwE7/m51EObs4o\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 262,
		"path": "../public/assets/workspace-routing-BVpUowaS.js"
	},
	"/assets/x-DWFBTG4r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d9-R/oikT/cobPxr8n2H56DaVSMTdI\"",
		"mtime": "2026-07-01T22:40:07.913Z",
		"size": 217,
		"path": "../public/assets/x-DWFBTG4r.js"
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
var _lazy_t41yph = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_t41yph
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

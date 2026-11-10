import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: {
		public: true,
		static: true,
		schema: (value) => value ?? ''
	}
});

/**
 * Single source of truth for contact email.
 * To switch to brant@brantsimpson.com after Cloudflare Email Routing is set up,
 * change the one constant below. Nothing else needs to change.
 */
export const CONTACT_EMAIL = "brant@brantsimpson.com";

/** Full mailto: href */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

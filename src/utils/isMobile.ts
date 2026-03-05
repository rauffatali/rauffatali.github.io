/**
 * Lightweight device-capability detection for adaptive quality.
 * Does NOT change any behaviour on desktop — only used to serve
 * lighter Three.js quality presets on mobile / tablet devices.
 */

let _isMobileResult: boolean | null = null;

/**
 * Returns `true` for phones and tablets where heavy WebGL scenes
 * are likely to cause lag. Result is cached after first call.
 */
export const isMobile = (): boolean => {
    if (_isMobileResult !== null) return _isMobileResult;
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
        _isMobileResult = false;
        return false;
    }

    const ua = navigator.userAgent;
    const mobileUA =
        /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // iPad with desktop-class UA still has touch + smaller viewport
    const touchSmallScreen =
        navigator.maxTouchPoints > 0 && window.innerWidth < 1024;

    _isMobileResult = mobileUA || touchSmallScreen;
    return _isMobileResult;
};

/**
 * Returns `true` when the user has requested reduced motion via OS settings.
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

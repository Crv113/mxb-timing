import { useEffect, useRef } from "react";

const useInfiniteScrollSentinel = (onIntersect, shouldObserve) => {
    const sentinelRef = useRef(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !shouldObserve) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onIntersect();
            }
        });

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [onIntersect, shouldObserve]);

    return sentinelRef;
};

export default useInfiniteScrollSentinel;

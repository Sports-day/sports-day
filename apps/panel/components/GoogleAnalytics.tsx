import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { existsGaId, GA_MEASUREMENT_ID, pageview } from '@/src/lib/gtag'

const GoogleAnalytics = () => {
    const location = useLocation()

    useEffect(() => {
        if (!existsGaId) return

        // GAスクリプトの初期化（まだロードされていない場合）
        if (!window.gtag) {
            const script = document.createElement('script')
            script.async = true
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
            document.head.appendChild(script)

            window.dataLayer = window.dataLayer || []
            window.gtag = function gtag(...args: unknown[]) {
                window.dataLayer.push(...args as Record<string, unknown>[])
            }
            window.gtag('js', new Date())
            window.gtag('config', GA_MEASUREMENT_ID, { page_path: window.location.pathname })
        }
    }, [])

    useEffect(() => {
        if (!existsGaId) return
        pageview(location.pathname + location.search)
    }, [location])

    return null
}

export default GoogleAnalytics

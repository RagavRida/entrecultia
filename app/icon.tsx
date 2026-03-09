import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c9a962', // Brand accent
                }}
            >
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Background shape */}
                    <path
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 40 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                    />
                    {/* Symbol */}
                    <path
                        d="M12 11C12 10.4477 12.4477 10 13 10H27C27.5523 10 28 10.4477 28 11C28 11.5523 27.5523 12 27 12H14V19H24C24.5523 19 25 19.4477 25 20C25 20.5523 24.5523 21 24 21H14V28H23.5858L27.2929 24.2929C27.6834 23.9024 28.3166 23.9024 28.7071 24.2929C29.0976 24.6834 29.0976 25.3166 28.7071 25.7071L24.4142 30H13C12.4477 30 12 29.5523 12 29V11Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}

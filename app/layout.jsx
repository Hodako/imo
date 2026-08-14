import './globals.css';

export const metadata = {
  title: 'imo: Free Video Calls and Messages - Official Website',
  description: "Stay connected with family and friends using imo's free video calling app. Enjoy free video chats, 1-on-1 calls, audio calls, and international calls!",
  icons: {
    icon: '/imo_files/imo.30ad61b6.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: '#009dff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="ltr" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="/imo_files/imo.30ad61b6.png" />
        <link href="/imo_files/chunk-vendors.15d78b96.css" rel="stylesheet" />
        <link href="/imo_files/chunk-common.4453297b.css" rel="stylesheet" />
        <link href="/imo_files/index.5a4d7a24.css" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

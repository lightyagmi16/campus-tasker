import './globals.css';

export const metadata = {
  title: 'Campus Tasker',
  description: 'Social tasking for campus with realtime chat',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

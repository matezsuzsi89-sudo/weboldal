export function Footer() {
  return (
    <footer
    className="border-t border-black/20 py-8"
    style={{
      background: 'linear-gradient(15deg, #2e3337 0%, #383E42 50%, #454c51 100%)',
      boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
    }}
  >
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-300">
        <p className="font-medium text-white">Precisolit Kft.</p>
        <p className="mt-1">Budapest · Sopron</p>
        <p className="mt-4 text-gray-400">
          © {new Date().getFullYear()} Precisolit Kft. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}

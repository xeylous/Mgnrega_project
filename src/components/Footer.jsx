export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-gradient-to-b from-yellow-300 to-yellow-500 text-black text-sm">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div>
          <h3 className="font-semibold mb-3">Useful Links/Support</h3>
          <ul className="space-y-1">
            <li>About Portal</li>
            <li>Terms of Use</li>
            <li>Policies</li>
            <li>Accessibility Statement</li>
            <li>GODL</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Middle Column */}
        <div>
          <ul className="space-y-1 mt-6 md:mt-0">
            <li>Chief Data Officers (CDOs)</li>
            <li>Link To Us</li>
            <li>Newsletters</li>
            <li>Sitemap</li>
            <li>Help</li>
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <p className="text-justify mb-3">
            This platform is designed, developed, and hosted by the{" "}
            <a href="#" className="text-blue-800 font-semibold underline">
              National Informatics Centre (NIC)
            </a>
            , Ministry of Electronics & Information Technology, Government of India. <br />
            Content is licensed under the{" "}
            <a href="#" className="text-blue-800 underline">
              Government Open Data License - India
            </a>
            .
          </p>
        </div>
      </div>

      <div className="bg-yellow-600 text-center py-2 text-xs text-black">
        © 2012–2025 GOVERNMENT OF INDIA. All rights reserved except published datasets/resources and metadata.
        <br />
        Last updated 01/11/2025 - 12:33:14
      </div>
    </footer>
  );
}

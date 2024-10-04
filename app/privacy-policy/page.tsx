import { FaLock, FaQuestionCircle } from "react-icons/fa";
const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-cente">Privacy Policy</h1>

      <p className="mb-4">
        <strong>Last updated:</strong> September 26, 2024
      </p>
      <p className="mb-6leading-relaxed">
        This Privacy Policy describes Our policies and procedures on the
        collection, use, and disclosure of Your information when You use the
        Invoice Generator App and explains Your privacy rights and how the law
        protects You. We use Your Personal Data to provide and improve the
        Service. By using the Service, You agree to the collection and use of
        information in accordance with this Privacy Policy.
      </p>
      <p className="mb-4"></p>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
          <FaLock /> Interpretation and Definitions
        </h2>

        <h3 className="text-2xl font-semibold mb-2">Interpretation</h3>
        <p className=" leading-relaxed mb-4">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>

        <h3 className="text-2xl font-semibold mb-2">Definitions</h3>
        <p className="leading-relaxed">
          For the purposes of this Privacy Policy:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>
            <strong>Account:</strong> A unique account created for You to access
            our Service.
          </li>
          <li>
            <strong>Company:</strong> Refers to InvoiceRaptor Inc.
          </li>
          <li>
            <strong>Device:</strong> Any device such as a computer, cellphone,
            or tablet.
          </li>
          <li>
            <strong>Personal Data:</strong> Information that relates to an
            identifiable individual.
          </li>
          <li>
            <strong>Service:</strong> The Invoice Generator App website and
            application.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
          <FaQuestionCircle /> Collecting and Using Your Personal Data
        </h2>

        <h3 className="text-2xl font-semibold mb-2">Types of Data Collected</h3>
        <h3 className="text-xl font-semibold mb-2">Personal Data</h3>
        <p className="leading-relaxed mb-6">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information, including, but not limited to:
          Email address, First name, and last name.
        </p>

        <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
        <p className="leading-relaxed mb-6">
          Usage Data is collected automatically when using the Service. It may
          include information such as Your Device&#39;s IP address, browser
          type, browser version, the pages You visit, the time and date of Your
          visit, and other diagnostic data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">
          Use of Your Personal Data
        </h2>
        <p className="leading-relaxed">
          We may use Personal Data to provide and maintain our Service, manage
          Your Account, perform contracts, and contact You. Additionally, Your
          data may be used for business transfers, analyzing usage trends, and
          improving our Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">
          Security of Your Personal Data
        </h2>
        <p className="leading-relaxed">
          We strive to protect Your Personal Data, but no method of transmission
          over the Internet or method of electronic storage is 100% secure.
          While we strive to use commercially acceptable means to protect Your
          Personal Data, we cannot guarantee its absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
        <p className="leading-relaxed mb-2">
          If you have any questions about this Privacy Policy, You can contact
          us:
        </p>
        <ul className="list-disc list-inside">
          <li>
            By email:{" "}
            <a
              href="mailto: support@invoiceraptor.com"
              className="text-blue-600 hover:underline"
            >
              support@invoiceraptor.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;

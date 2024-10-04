export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 rounded-md shadow-lg bg-white dark:bg-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Terms of Service
      </h1>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Last updated:</strong> September 26, 2024
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Please read these terms and conditions carefully before using Our
        Invoice Generator App.
      </p>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Interpretation and Definitions
        </h2>
        <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Interpretation
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>
        <h3 className="text-2xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-300">
          Definitions
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          For the purposes of these Terms and Conditions:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Affiliate:</strong> An entity that controls, is controlled
            by, or is under common control with a party, where control means
            ownership of 50% or more of the shares, equity interest, or other
            securities entitled to vote for election of directors or other
            managing authority.
          </li>
          <li>
            <strong>Company:</strong> Refers to InvoiceRaptor Inc., located at
            COMPANY ADDRESS.
          </li>
          <li>
            <strong>Device:</strong> Any device such as a computer, cellphone,
            or tablet.
          </li>
          <li>
            <strong>Service:</strong> Refers to the Invoice Generator App
            website and application.
          </li>
          <li>
            <strong>Terms and Conditions:</strong> These Terms and Conditions
            form the entire agreement between You and the Company regarding the
            use of the Service.
          </li>
          <li>
            <strong>Third-party Social Media Service:</strong> Any services or
            content provided by a third-party that may be displayed, included,
            or made available by the Service.
          </li>
          <li>
            <strong>You:</strong> The individual accessing or using the Service,
            or the company, or other legal entity on behalf of which such
            individual is accessing or using the Service, as applicable.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Acknowledgment
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          These are the Terms and Conditions governing the use of this Service
          and the agreement that operates between You and the Company. These
          Terms and Conditions set out the rights and obligations of all users
          regarding the use of the Service.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          By accessing or using the Service, You agree to be bound by these
          Terms and Conditions. If You disagree with any part of these Terms and
          Conditions, then You may not access the Service.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          You represent that you are over the age of 18. The Company does not
          permit those under 18 to use the Service.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Your access to and use of the Service is also conditioned on Your
          acceptance of and compliance with the Privacy Policy of the Company.
          Our Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your personal information when You
          use the Service. Please read Our Privacy Policy carefully.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Links to Other Websites
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Our Service may contain links to third-party websites or services that
          are not owned or controlled by the Company. The Company assumes no
          responsibility for the content, privacy policies, or practices of any
          third-party websites.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Limitation of Liability
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          To the maximum extent permitted by applicable law, in no event shall
          the Company or its suppliers be liable for any special, incidental,
          indirect, or consequential damages whatsoever arising out of or in
          connection with Your use of the Service.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Governing Law
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          The laws of the Country, excluding its conflicts of law rules, shall
          govern this Terms and Your use of the Service.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Changes to These Terms and Conditions
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We reserve the right to modify or replace these Terms at any time. If
          a revision is material, we will provide at least 30 days notice prior
          to any new terms taking effect. By continuing to access or use Our
          Service after those revisions become effective, You agree to be bound
          by the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Contact Us
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions about these Terms and Conditions, you can
          contact us:
        </p>
        <ul className="list-inside text-gray-700 dark:text-gray-300">
          <li>
            By email:{" "}
            <a
              href="mailto:support@invoiceraptor.com"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              support@invoiceraptor.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

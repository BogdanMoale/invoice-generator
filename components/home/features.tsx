const FeatureSection = () => {
  return (
    <section className="w-full py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Quick and Easy",
              description: "Create, manage, and track invoices effortlessly.",
              icon: "🧾",
            },
            {
              title: "Easy Filtering",
              description:
                "Filter invoices by customer name,email,invoice number",
              icon: "🔍",
            },
            {
              title: "Status of invoices",
              description:
                "Check which invoices have been paid and which are still owing",
              icon: "✅",
            },
          ].map(({ title, description, icon }, index) => (
            <div
              key={index}
              className="p-6 bg-blue-100 dark:bg-black rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-white">
                {title}
              </h3>
              <p className="text-blue-800 dark:text-white">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

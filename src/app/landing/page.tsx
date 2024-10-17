import React from "react";
import Link from "next/link";
import PricingPage from "../pricing/page";

const Landing = () => {
  return (
    <div className="h-[100%] p-6 md:p-10 overflow-scroll ">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-200 mb-6">
          Supercharge Your Sales Strategy
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-6">
          Unlock data-driven insights to grow your business. With just a few
          clicks, discover related companies, detailed contact information, and
          advanced business analytics.
        </p>
        <Link
          href="/sign-up"
          className="mt-6 inline-block px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-500 hover:to-blue-700 transition-all text-lg"
        >
          Get Started for Free
        </Link>
        <p className="text-gray-400 text-sm mt-4">
          No credit card required. Cancel anytime.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="my-16">
        <h2 className="text-4xl font-extrabold text-gray-200 text-center mb-8">
          Why Choose Our Sales SaaS App?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Targeted Company Discovery
            </h3>
            <p className="text-gray-300">
              Discover thousands of related companies with a few clicks. Our
              data engine uncovers potential leads based on your input, creating
              endless opportunities for growth.
            </p>
          </div>
          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Key People Insights
            </h3>
            <p className="text-gray-300">
              Get detailed contact information for C-level executives and key
              decision-makers. Build your target list with high-quality leads
              that are relevant to your sales goals.
            </p>
          </div>
          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Geographic Intelligence
            </h3>
            <p className="text-gray-300">
              Visualize company locations across the globe, and understand their
              geographic reach. Pinpoint regional opportunities and expand your
              network with location-based data.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="my-16">
        <h2 className="text-4xl font-extrabold text-gray-200 text-center mb-8">
          Everything You Need to Scale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Competitor Analysis
            </h3>
            <p className="text-gray-300">
              Understand your competition with detailed insights. See what
              products, services, and strategies your competitors are using to
              stay ahead, and use this information to outsmart them.
            </p>
          </div>

          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Philanthropy & Ethics Insights
            </h3>
            <p className="text-gray-300">
              Explore company philanthropic efforts and corporate ethics.
              Partner with companies that align with your values and build
              deeper, more meaningful relationships.
            </p>
          </div>

          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              State and Region-Specific Searches
            </h3>
            <p className="text-gray-300">
              Narrow your focus with searches targeted by state, country, or
              continent. Whether you're looking to expand locally or globally,
              find the right companies in the right places.
            </p>
          </div>

          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Endless Loop of Opportunities
            </h3>
            <p className="text-gray-300">
              Start with one company, and follow a chain of endless connections.
              Every related company opens up new leads, ensuring you never run
              out of opportunities to pursue.
            </p>
          </div>

          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Actionable Data at Your Fingertips
            </h3>
            <p className="text-gray-300">
              Our easy-to-use interface puts data in your hands without the need
              for complex tools. Export lists, target companies, and track your
              success—all in one place.
            </p>
          </div>

          <div className="p-7 border border-gray-600 rounded-lg shadow-2xl bg-alt hover:border-teal-400 hover:bg-opacity-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Industry Leading Support
            </h3>
            <p className="text-gray-300">
              Our support team is always here to help. Whether you're just
              getting started or need advanced tips on using our platform, we've
              got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="my-10 bg-gray-800 p-8 rounded-lg">
        <h2 className="text-4xl font-extrabold text-gray-200 text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-gray-600 rounded-lg bg-alt shadow-2xl">
            <p className="text-gray-300 mb-4">
              "This platform completely transformed how we approach sales. The
              insights into related companies and the ability to quickly contact
              decision-makers is unparalleled."
            </p>
            <p className="text-teal-400 font-bold">– Alex W., VP of Sales</p>
          </div>
          <div className="p-6 border border-gray-600 rounded-lg bg-alt shadow-2xl">
            <p className="text-gray-300 mb-4">
              "The location data allowed us to identify new regional markets.
              We’ve expanded into three new areas since using the platform."
            </p>
            <p className="text-teal-400 font-bold">
              – Rachel M., Business Development Manager
            </p>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <div>
        <PricingPage scroll={false} />
      </div>

      {/* Call to Action Section */}
      <section className="mt-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-200 mb-6">
          Start Your Free Trial Today!
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          Join the growing number of businesses using our platform to
          supercharge their sales strategy. No risk, no credit card required.
        </p>
        <Link
          href="/sign-up"
          className="inline-block px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-500 hover:to-blue-700 transition-all text-lg"
        >
          Get Started for Free
        </Link>
      </section>
    </div>
  );
};

export default Landing;

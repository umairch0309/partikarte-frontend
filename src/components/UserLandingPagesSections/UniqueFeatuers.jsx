import React from "react";
import "./UniqueFeatuers.scss";
import { ReactSVG } from "react-svg";

const features = [
  {
    title: "Guestlist",
    icon: "/icons/features/guestlist.svg",
    description:
      " The application is designed to receive and record guests, simplify work with promoters and allows multiple administrators to work from multiple devices at the same time. Guests can be grouped upand assigned different rules and restrictions. It also offers aneasy way to import larger lists of guests and an overview of past entrances for particular guests.",
  },
  {
    title: "Promotional codes",
    icon: "/icons/features/promotional-codes.svg",
    description:
      "A great tool to drive sales and reward your regular customers! Specify a code name and give it a discount. Distribute the code to potential customers through your advertising channels to encourage the purchase.",
  },
  {
    title: "Repeating events",
    icon: "/icons/features/repeating-events.svg",
    description:
      "The feature allows you to create variations of your umbrella event. In addition to the time and date, each iteration can be customized with a description, display picture, ticket type and other details. Your customers choose the date from the menu bar and make a purchase.",
  },
  {
    title: "Invoice overview",
    icon: "/icons/features/invoice.svg",
    description:
      "The platform is tailored for your carefree business! All the invoices and documents you need for accounting are ready for an easy export. All you have to do is select the desired event and date range.",
  },
  {
    title: "Limit tickets quantity",
    icon: "/icons/features/ticket-quantity.svg",
    description:
      "Since your venue has limited capacity, you can limit the amount of tickets from the online backoffice, now sales will not exceed capacity even in high demand. Rules can be set for the whole event or just for a ticket contingent.",
  },
  {
    title: "Ticket check-in",
    icon: "/icons/features/ticket-checkin.svg",
    description:
      "Install the free app and your mobile phone is ready for a quick ticket check. By scanning the QR code, you check the validity, the system records all incomes and rejects duplicate or fake tickets.",
  },
  {
    title: "Ticketing API",
    icon: "/icons/features/ticketing-api.svg",
    description:
      "With easy and transparent seating display, which updates in real-time, your seats are organized and visitors are happy. This is the ideal solution for venues and events with seating arrangements! You can sell tickets online, through our sales network or in your own box office.",
  },
  {
    title: "Sale reports",
    icon: "/icons/features/sale-reports.svg",
    description:
      "Beautiful graphs and statistics allow you to understand your business in more detail. A complete overview is available in the online backoffice, here you can also find the sales status, which is broken down by sales channels and updated in real-time.",
  },
  {
    title: "Configure VAT",
    icon: "/icons/features/configure-vat.svg",
    description:
      "Access to all your tickets, or only a specific contingent, can be restricted by a password. Only customers, who you allow to, can make a purchase. This keeps your private event private and is attended only by expected guests.",
  },
  {
    title: "Customization",
    icon: "/icons/features/customization.svg",
    description:
      "The tool lets you track the performance of promoters and ad campaigns. You define the code by which the system generates a tracking link, which you then distribute to your advertising channels. This gives you an overview of the number of clicks and purchases that came from individual links in your web office.",
  },
  {
    title: "Seating arangement",
    icon: "/icons/features/seating.svg",
    description:
      "In the online backoffice you will find a tab that is designed for selling tickets through your own sales channels. Create tickets and distribute them as you wish, within your sales channels. You can print them or send them directly from the web office to the emails of your promoters and clients.",
  },
  {
    title: "Integrations",
    icon: "/icons/features/integrations.svg",
    description:
      "Contingents are limited quantity sets of tickets at a fixed price. Usually, first-party promoters offer cheaper tickets when the set amount goes, followed by a price increase with the transition to a new contingent. Our automation keeps sales running smoothly, automatically unlocking a new one after a contingent sells out, even without your presence.",
  },
];

const UniqueFeatuers = () => {
  return (
    <div className="unique-featuers-section">
      <div className="unique-features-header">
        <p>Features</p>
        <h1>Our Unique Features.</h1>
        <div className="unique-features-container">
          {features.map((e) => {
            return (
              <div className="feature-item">
                <ReactSVG src={e.icon} />
                <h3>{e.title}</h3>
                <p>{e.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UniqueFeatuers;

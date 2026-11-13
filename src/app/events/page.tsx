import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events & stories",
  description: "Charity tournaments, fairs, concerts, drives and campaigns organised by Act for Community in Bishkek — and the causes they supported.",
};

export default function EventsPage() {
  const events = getEvents();
  return (
    <>
      <PageHero
        eyebrow="Previous events & stories"
        tone="sky"
        title={[["Every event is"], ["a story of"], [{ text: "people helping people.", accent: true }]]}
        intro="From summer volleyball to winter gift drives — here is what we've organised so far, and who it supported."
      />
      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <EventsExplorer events={events} />
        </div>
      </section>
      <TwoPaths title="Want to be part of the next story?" />
    </>
  );
}

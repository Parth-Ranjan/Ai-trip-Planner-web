import PlaceCardItem from './PlaceCardItem';


const PlacesToVisit = ({ trip }) => {
  const travelPlan = trip?.generatedPlan?.travelPlan;

  if (!travelPlan) return <p>No travel plan available.</p>;

  return (
    <div className="mt-10 px-4">
      <h2 className="text-3xl font-bold mb-8">Places to Visit</h2>

      {Object.entries(travelPlan).map(([day,places], index) => (
        <PlaceCardItem key={index} places={places} index={index} />
      ))}
    </div>
  );
};

export default PlacesToVisit;

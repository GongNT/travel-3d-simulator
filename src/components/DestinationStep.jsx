export default function DestinationStep({ onContinue }) {
  return (
    <div className="destination-step">
      <label htmlFor="destination">Where do you want to go?</label>
      <input id="destination" type="text" value="Nice, France" disabled />
      <p className="destination-note">
        This demo is scoped to Nice, France. More destinations coming soon.
      </p>
      <button onClick={onContinue}>Continue</button>
    </div>
  )
}

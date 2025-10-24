import '../styles/ScrollButtons.css'

export default function ScrollButtons({ scrollToTop, scrollToBottom }) {
  return (
    <div className="scroll-buttons-container">
      <button className="scroll-buttons" onClick={scrollToTop}>⬆️ Przewiń do góry</button>
      <button className="scroll-buttons" onClick={scrollToBottom}>⬇️ Przewiń na dół</button>
    </div>
  );
}

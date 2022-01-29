const tipAmount = '0.1';
const StickerSet = (props) => (
    <div className="image-item stickeritem"  >
        <div>{props.stickerset.name}</div>
        <div>Tips: {props.stickerset.tips}</div>
        <img className="stickeritem" src="https://images.unsplash.com/photo-1640590272119-e2c936055d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDMyM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzI2MTU0MA&ixlib=rb-1.2.1&q=80&w=1080" />
        <a
            href="/"
            onClick={async (event) => {
                event.preventDefault();
                await props.tip(props.stickerset.name, props.stickerset.owner.wallet, tipAmount);
            }}
        >
            Tip Owner
        </a>
    </div>
);

export default StickerSet;
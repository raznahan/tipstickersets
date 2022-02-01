const tipAmount = '0.1';
const imgUrl = 'http://localhost:3000';
const StickerSet = (props) => (
    <div className="image-item stickeritem"  >
        <div>{props.stickerset.name}</div>
        <div>Tips: {props.stickerset.tips}</div>
        <img className="stickeritem" 
        src={props.stickerset.thumbnail =='dummy thumbnail' ?
         "https://images.unsplash.com/photo-1640590272119-e2c936055d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDMyM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzI2MTU0MA&ixlib=rb-1.2.1&q=80&w=1080"
         :imgUrl+props.stickerset.thumbnail} />
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
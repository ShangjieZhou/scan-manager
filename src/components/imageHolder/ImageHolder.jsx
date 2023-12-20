import "./ImageHolder.scss";

export default function ImageHolder(props) {
  return (
    <div onClick={props.onClick} className="image-holder">
      {props.image ? <img src={URL.createObjectURL(props.image)}/> : <h3>Upload Image</h3>}
    </div>
  )
}
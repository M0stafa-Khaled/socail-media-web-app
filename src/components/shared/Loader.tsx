interface IProps {
  height?: number;
  width?: number;
  className?: string;
}

const Loader = ({ height = 24, width = 24, className }: IProps) => {
  return (
    <div className={`flex-center ${className}`}>
      <img
        src="/assets/icons/loader.svg"
        alt="loaderS"
        width={width}
        height={height}
      />
    </div>
  );
};
export default Loader;

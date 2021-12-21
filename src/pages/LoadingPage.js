function LoadingPage(props) {
    return (
        <div>
            <progress id="chunkLoading" value={props.progressBar} max="100" />
            <div>{props.progressBar}% of data downloaded</div>
        </div>
    );
}

export default LoadingPage;

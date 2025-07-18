import styled from 'styled-components';

const ShimmerEffect = () => {
  return (
    <StyledWrapper>
      <div id="container">
        <div id="square" className="shimmer" />
        <div id="content">
          <div id="content-title" className="shimmer" />
          <div id="content-desc">
            <div className="line shimmer" />
            <div className="line shimmer" />
            <div className="line shimmer" />
            <div className="line shimmer" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .shimmer {
    position: relative;
    background: #3a3a3a;
    background-image: linear-gradient(to right, #3a3a3a 0%, #3f3f3f 10%, #4a4a4a 20%, #3f3f3f 30%, #3a3a3a 50%, #3a3a3a 100%);
    background-repeat: no-repeat;
    background-size: 800px 200px;
    -webkit-animation-duration: 1s;
    -webkit-animation-fill-mode: forwards;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-name: shimmer;
    -webkit-animation-timing-function: ease-in-out;
  }

  @-webkit-keyframes shimmer {
    0% {
      background-position: -400px 0;
    }

    100% {
      background-position: 400px 0;
    }
  }

  #container {
    width: 400px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #square {
    width: 135px;
    height: 135px;
  }

  #content {
    flex: 1;
    height: 150px;
    width: 100%;
    padding: 0.5rem 1rem 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }

  #content-title {
    width: 100%;
    height: 30px;
    margin-bottom: 1rem;
  }

  #content-desc {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-end;
  }

  .line {
    width: 100%;
    height: 10px;
  }`;

export default ShimmerEffect;

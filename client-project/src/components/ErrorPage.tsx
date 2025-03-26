import imageUrl from '../../public/pictures/error404.jpg'
function ErrorPage(){

return (
    <>
     <div style={{position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)", 
          zIndex: 9999, }}>
      <img src={imageUrl} style={{ 
          width: "100%",
          height: "100%",
          objectFit: "cover"}} />
    </div>
    </>
)
}

export default ErrorPage;
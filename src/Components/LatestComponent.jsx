export default function Latest() {
    return (     <section>
          
          <div className="index-wrapper-latest">
            {articlesToDisplay.length > 0 ? (
              articlesToDisplay.map((item) => (
                <Link
                  to={`/content/main/latest/${item.Id}`}
                  className='wrapper-index-link'
                  key={item.Id}
                >
                  {item.ImagePlaceholder && item.ImagePlaceholder !== "/Images/logo192.png" ? (
                    <div className="img-index-link">
                      <img src={item.ImagePlaceholder} alt={item.TopicName} />
                    </div>
                  ) : null}

                  <div className="wrapper-index-link-cnt">
                    <h3>{item.TopicName}</h3>
                    <span>
                      <i>Posted by:</i> <b>{item.Author}</b>
                      <span>
                        <i className="bi bi-chat-dots-fill"></i>
                        {item.NumberPosts}
                      </span>
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="spinner"></div>
            )}
          </div>
          <div className="wrapper-index-tgle-btn">
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button onClick={handleNext} disabled={currentPage >= articles.length - 3}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

        </section>)
}
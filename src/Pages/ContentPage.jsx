import { useParams, Outlet } from 'react-router-dom';
import ContentPresenter from '../Components/ContentPresenter';
import SearchBar from '../Components/SearchBar';
import { useArticleData } from '../Hooks/Content/useArticleData';

export default function ContentPage() {
    
    const { filterType, filterValue } = useParams(); 

    const {
        articles,
        isLoading,
        hasMoreArticles,
        loadMoreArticles,
    } = useArticleData(filterType, filterValue);

    let pageTitle = 'Browse Latest';
    
    if (filterType === 'author') {
        pageTitle = `Articles by ${filterValue}`;
    } else if (filterType === 'tag') {
        pageTitle = `Articles tagged "${filterValue}"`;
    }

    return (
        <>
            <div className='pages-wrapper'>
                
                <div>
                    <SearchBar />
                </div>

                {isLoading ? (
                    <div className='spinner'></div>                
                ) : (
                    <ContentPresenter list={articles} />
                )}

                {!isLoading && hasMoreArticles && (
                    <button 
                        onClick={loadMoreArticles}
                        className="load-more-btn load-more-btn-content">
                        Load More
                    </button>
                )}

            </div>
            
            <Outlet />
        </>
    );
}

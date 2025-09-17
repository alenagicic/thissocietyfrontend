import { Link, useParams } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { useEffect, useState } from 'react';
import { getRequest } from '../Utils/api';

export default function ContentPresenter({ list }) {

    const { filterType, filterValue } = useParams();

    const [headerText, setHeaderText] = useState("");

    let articlePath = `/content`;
    if (filterType && filterValue) {
        articlePath = `${articlePath}/${filterType}/${filterValue}`;
    }

    useEffect(() => {
        const fetchAuthorData = async () => {
            if (list && list.length > 0) {
                try {
                    let req = await getRequest(`/account?userId=${list[0].AuthorPrimaryId}`);
                    
                    setHeaderText(req.data.username);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setHeaderText("");
                }
            }
        };

        if (filterType === "author") {
            fetchAuthorData();
        } else if (filterType === "tag") {
            setHeaderText(filterValue);
        } else {
            setHeaderText("");
        }
        
    }, [list, filterType, filterValue]);

    return (
        <div className='wrapper-content-presenter'>
            {headerText && (
                <p className='author-title'>
                    <b>{filterType === "author" ? "Content By: " : "Browsing Tag: "}</b>
                    <i><b>{headerText}</b></i>
                </p>
            )}

            {list.map((item) => (
                <Link
                    to={`${articlePath}/${item.Id}`}
                    className='wrapper-link-content'
                    key={item.Id}
                >
                    <ArticleCard article={item} />
                </Link>
            ))}
        </div>
    );
}
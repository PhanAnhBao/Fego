import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryById, getProductAllowCategory } from '../../api/service/category.service';
import { addToCart } from "../../helpers/cart.helper";
import { titleTab } from "../../utils/titleGenerate";
import Pagination from "../pagination";
import ReactLoading from 'react-loading';

function ProductCategories() {
    const [list, setList] = useState([]);
    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPage, setItemPage] = useState(9);

    const [done, setDone] = useState(undefined);
    const indexOfLastItem = currentPage * itemPage;
    const indexOfFirstItem = indexOfLastItem - itemPage;
    const currentPages = list.slice(indexOfFirstItem, indexOfLastItem);
    let cart = [];
    const { id } = useParams();
    useEffect(() => {
        setTimeout(() => {
            getProductAllowCategory(id)
                .then((res) => {
                    setList(res.data);
                    setDone(true);
                })
                .catch((err) => {
                    console.log(err);
                })
        }, 2000)
    }, []);

    useEffect(() => {

        getCategoryById(id)
            .then((res) => {
                setName(res.data.category_name);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    titleTab(name);
    function paginate(number) {
        setCurrentPage(number);
    }
    const handleAddToCart = (item, cart) => {
        addToCart(item, cart);
    }
    return (
        <div className='Home'>

            <div className="products--new">
                <h2 className="products--new__h2">
                    {name}
                </h2>
            </div>
            {!done ? (
                <ReactLoading
                    type={'spinningBubbles'}
                    color={'#976b43'}
                    height={'20%'}
                    width={'20%'}
                />
            ) : (
                <div>
                    <div className="products--new__row">
                        {
                            currentPages.length === 0 ? <h1>S???n ph???m hi???n ch??a c??</h1> :
                                (
                                    currentPages.map(function (item) {
                                        return (
                                            <div className='products--items'>
                                                <div class="products--items__img">
                                                    <img src={`/${item.product_image}`} alt="rings" />
                                                    <div className="overlay">
                                                        <div className="text">
                                                            <img src={`/${item.product_image1}`} alt="rings" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="products--items__main">
                                                    <a href={`/productdetails/${item.product_slug}`}>{item.product_name}</a>
                                                    <p><span className='price__product'>Gi??:</span> {item.product_price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
                                                    <button onClick={() => handleAddToCart(item, cart)} className="border__button">Th??m v??o gi??? h??ng</button>
                                                </div>
                                                <span className="new"></span>
                                            </div>
                                        )
                                    })
                                )

                        }
                    </div>
                    <div class="pag">
                        <Pagination itemPage={itemPage} totalPage={list.length} paginated={paginate} current={currentPage} />
                    </div>
                </div>)}
            
        </div>
    );
}

export default ProductCategories;
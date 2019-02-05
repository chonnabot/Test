import React, { Component } from 'react';
import { Spin, Modal, Button, Layout, Menu, message, Input, Icon, Row, Col } from 'antd';
import RouteMenu from './RouteMenu';
import { connect } from 'react-redux';

const { Header, Content, Footer } = Layout;
const menus = ['movies', 'favorite', 'profile'];
const KEY_USER_DATA = 'user_data';

const Search = Input.Search;

var GphApiClient = require('giphy-js-sdk-core')
const client = GphApiClient("E9q3svPQ1G6boeQhQ2NCVLyY3rcH90L7&limit=400&rating=G")

const mapStateToProps = state => {
    return {
        isShowDialog: state.isShowDialog,
        itemGiphyClick: state.itemGiphyDetail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDismissDialog: () =>
            dispatch({
                type: 'dismiss_dialog'
            }),
        onItemGiphyClick: item =>
            dispatch({
                type: 'click_item',
                payload: item
            })
    }
}

class Main extends Component {
    state = {
        items: [],
        itemGiphy: null,
        pathName: menus[0],
        favItems: [],
        isShowDialog: false
    };

    onModalClickOk = () => {
        // TODO: handle something click ok
        this.props.onDismissDialog();
    };

    onModalClickCancel = () => {
        this.props.onDismissDialog();
    };

    componentDidMount() {
        const jsonStr = localStorage.getItem('list-fav');
        if (jsonStr) {
            const items = jsonStr && JSON.parse(jsonStr);
            this.setState({ favItems: items });
        }

        const { pathname } = this.props.location;
        var pathName = menus[0];
        if (pathname != '/') {
            pathName = pathname.replace('/', '');
            if (!menus.includes(pathName)) pathName = menus[0];
        }
        this.setState({ pathName });
        fetch('https://api.giphy.com/v1/gifs/trending?api_key=E9q3svPQ1G6boeQhQ2NCVLyY3rcH90L7&limit=400&rating=G')
            .then(response => response.json())
            .then(giphy => this.setState({ items: giphy.data, results: giphy.data }));
    }

    onMenuClick = e => {
        var path = '/';
        if (e.key != 'giphy') {
            path = `/${e.key}`;
        }
        this.props.history.replace(path);
    };

    onClickFavorite = () => {
        const itemClick = this.props.itemGiphyClick;
        const items = this.state.favItems;

        const result = items.find(item => {
            return item.title === itemClick.title;
        });

        if (result) {
            message.error('This item added favorite', 1);
        } else {
            items.push(itemClick);
            localStorage.setItem('list-fav', JSON.stringify(items));
            message.success('Saved your favorite Giphy', 1);
            this.onModalClickCancel();
        }
    };

    onClickCopy = () => {
        const item = this.props.itemGiphyClick;
        navigator.clipboard.writeText(item.images.fixed_width.url)
        message.success('Copy your giphy', 1);
    }

    showDialogConfirmLogout = () => {
        this.setState({ isShowDialog: true });
    };

    handleCancel = () => {
        this.setState({ isShowDialog: false });
    };

    handleOk = () => {
        localStorage.setItem(KEY_USER_DATA, JSON.stringify({ isLoggedIn: false }));
        this.props.history.push('/');
    };

    searchGiphy = (value) => {
        console.log("value", value)
        client.search('gifs', { "q": value })
            .then((response) => {
                response.data.forEach((gifObject) => {
                    console.log(gifObject)
                })
                this.setState({ items: response.data })
            })
            .catch((err) => {

            })
    }

    render() {
        const item = this.props.itemGiphyClick;
        return (
            <div>
                {this.state.items.length > 0 ? (
                    <div style={{ height: '100vh' }}>
                        {' '}
                        <Layout className="layout" style={{ background: 'white' }}>
                            <Header
                                style={{
                                    padding: '0px',
                                    position: 'fixed',
                                    zIndex: 1,
                                    width: '100%'
                                }}
                            >
                                <Row type="flex" justify="space-around" align="middle">
                                    <Col span={12}>
                                        <Search
                                            placeholder="input search text"
                                            onSearch={this.searchGiphy}
                                            enterButton
                                            style={{ marginTop: "15px" }}
                                        />
                                    </Col>
                                    <Col span={10} >
                                        <Menu
                                            theme="dark"
                                            mode="horizontal"
                                            defaultSelectedKeys={[this.state.pathName]}
                                            align='center'
                                            style={{ lineHeight: '64px' }}
                                            onClick={e => {
                                                this.onMenuClick(e);
                                            }}
                                        >
                                            <Menu.Item key={menus[0]} ><Icon type="home" />Home</Menu.Item>
                                            <Menu.Item key={menus[1]}><Icon type="heart" />Favorite</Menu.Item>
                                            <Menu.Item key={menus[2]}><Icon type="user" />Profile</Menu.Item>
                                        </Menu>
                                    </Col>

                                    <Col span={2}  >
                                        <Button htmlType="submit" type="primary" onClick={this.showDialogConfirmLogout} align='right' ><Icon type="poweroff" /> Logout</Button>
                                    </Col>
                                </Row>
                            </Header>
                            <Content
                                style={{
                                    padding: '16px',
                                    marginTop: 64,
                                    minHeight: '600px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <RouteMenu items={this.state.items} />
                            </Content>
                            <Footer style={{ textAlign: 'center', background: 'white' }}>
                                Giphy Application Workshop @ CAMT
                            </Footer>
                        </Layout>
                    </div>
                ) : (
                        <Spin size="large" />
                    )}
                {item != null ? (
                    <Modal
                        width="40%"
                        style={{ maxHeight: '70%' }}
                        title={item.title}
                        visible={this.props.isShowDialog}
                        onCancel={this.onModalClickCancel}
                        footer={[
                            <Button
                                key="submit"
                                type="primary"
                                icon="heart"
                                size="large"
                                shape="circle"
                                onClick={this.onClickFavorite}
                            />,
                            <Button
                                key="submit"
                                type="primary"
                                icon="copy"
                                size="large"
                                shape="circle"
                                onClick={this.onClickCopy}
                            />
                        ]}
                    >
                        {item.images != null ? (
                            <img src={item.images.fixed_width.url} style={{ width: '100%' }} />
                        ) : (
                                <div></div>
                            )}
                        {/*  */}
                        <br />
                        <br />
                        <p>{item._score}</p>
                    </Modal>
                ) : (
                        <div />
                    )}
                <Modal
                    title="Logout"
                    visible={this.state.isShowDialog}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    <p>Are you sure to logout?</p>
                </Modal>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
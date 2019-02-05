import React from 'react';
import ItemGiphy from './ItemMovie';
import { List, Pagination } from 'antd';

function ListGiphy(props) {
  return (
    <div>

      <List
        pagination={{pageSize : 40}} 
        grid={{ gutter: 16, column: 4 }}
        dataSource={props.items}
        renderItem={item => (
          <List.Item>
            <ItemGiphy item={item} onItemGiphyClick={props.onItemGiphyClick} />
          </List.Item>
        )}
        
      />
  
      {/* <Pagination total={100} pageSize={40}  style = {{textAlign : "center"}}/> */}
    </div>
      
  );
}

export default ListGiphy;

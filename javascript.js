



    var pricebx_length;
    var cart = new Object();
    var cartArr = new Array();
    var cartArr_sum = new Array();
    var 상품, 카트상품;
    var final_sum;

    fetch('store.json').then(res => res.json()).then(function (data) {
        var pro = data.products
        pro.forEach(( a , i ) => {
            var 상품 = `
            <div id="price_box" draggable="true">
                <img src="${pro[i].photo}" alt="">
                <h3 id="title">${pro[i].title}</h3>
                <p id="brand">${pro[i].brand}</p>
                <span>가격 :</span>
                <span id="price">${pro[i].price}</span>
                <br>
                <button id="buy_btn" class="btn_design">구매</button>
            </div>
            `
            var 카트상품 = `
            <div class="price_box_incart">
                <img src="${pro[i].photo}" alt="">
                <h3 id="title">${pro[i].title}</h3>
                <p id="brand">${pro[i].brand}</p>
                <span id="price">${pro[i].price}</span>
                <input id="input_count" type="text" placeholder="수량" value="1" onkeyup="numbering()">
            </div>
            `
            document.querySelector('.products').insertAdjacentHTML('beforeend', 상품)



            // 구매버튼 눌렀을때.
            document.querySelectorAll('#buy_btn')[i].addEventListener('click', function (e){ 

                e_title = $(e.target).siblings('#title').text();
                e_brand = $(e.target).siblings('#brand').text();
                e_price = $(e.target).siblings('#price').text();

                cart.title = e_title
                cart.brand = e_brand
                cart.price = e_price

                var check = cartArr.some(x => x.title == cart.title);
                var checked = cartArr.filter(x => x.title == cart.title);
                pricebx_length = document.querySelectorAll('.price_box').length; 
                
                if (check == false) { 
                    cart.number1 = 1;
                    cartArr.push(cart);
                    document.querySelector('.drag_box').insertAdjacentHTML('beforeend', 카트상품)
                    document.querySelector('.result_box').style.display = 'block';
                    $('.drag_info').html('');
                    cart = {};
                } else if (check == true) {
                    checked[0].number1 ++;
                    cart = {};
                } 

                    // 2022-07-14 장바구니에 담긴 새 상품 박스와 cartArr 배열에 담긴 상품 개수와 일치하게 만드는 코드.
                    // 쉽게 말하자면 상품 개수도 뜨게 하는건데 생각보다 잘 안되서 꽤 오래걸렸다.
                    // 상단 구매버튼을 누르면 장바구니에 상품이 담기며 상품 개수가 증가한다.

                    cartArr.forEach((abc, i) => { 
                    // console.log('상품명:'+abc.title+' 갯수:'+abc.number1 +'가격:'+abc.price)
                    $('.price_box_incart').eq(i).children('#input_count').val(abc.number1);
                    // 장바구니 마크업의 input 밸류값을 각각의 요소의 상품개수(number1)로 적용시킨다. index를 eq(i)로 해줘야 모든 상품에 적용된다.
                    })

                    // 2022-07-15 상품 가격 합계 코드.
                    var final_sum = cartArr.map(function(x){ return x.price * x.number1 }).reduce(function(a, b){ return a + b; }); 
                    // cartArr 배열에 파라미터를 추가한 다음, 각각의 가격과 갯수를 곱한다. 특징은 새로운 배열로써 만들어지기 때문에 데이터가 계속 유지된다.
                    // reduce 함수를 사용해 모든 요소를 합쳐준다.
                    $('#result_value').html(`<span>${final_sum}</span>`);
                    // 이 코드를 구매버튼 이벤트에만 넣게되면 input 태그에서 직접 수정했을때는 안바뀌는 버그가 나타난다.
                    // 142번째 라인에 중복으로 위 코드를 넣어주면 구매버튼을 누르던, input태그에서 수정하던 똑같은 합계가 나온다.
                    cartArr_sum = final_sum // 합계를 다른 배열로 뺀 다음 영수증창에서 띄워준다.
                });
            });
        })
        .catch(function(error){
            console.log('불러오지 못했습니다.')
        });




        function dragEnter(e) {
            e.preventDefault(); 
        }

            fetch('store.json').then(res => res.json()).then(function (data) {
                var pro = data.products
                pro.forEach(( a , i ) => {
                    var 카트상품 = `
                    <div class="price_box_incart">
                        <img src="${pro[i].photo}" alt="">
                        <h3 id="title">${pro[i].title}</h3>
                        <p id="brand">${pro[i].brand}</p>
                        <span id="price">${pro[i].price}</span>
                        <input id="input_count" type="text" placeholder="수량" value="1" onkeyup="numbering()">
                    </div>
                    `

                        // 2022-07-20
                        // 상품을 드래그해서 구매하는 기능을 구현하던 중 가장 큰 난관이었다.
                        // forEach 함수 구역에 drop을 같이 두면 결과가 4개가 생성되는 버그가 발생.
                        // 바깥으로 빼자니 var 카트상품이 인식이 안된다. (지역변수라서)
                        // 해결방법 : dragstart만 forEach 함수 구역에 두면서, #price_box에 i를 붙여 기존 구매버튼처럼 코드를 작성하고
                        // 변수 카트상품을 setData를 사용해 drop 함수로 옮기면 된다. (이게 가장 중요함)

                    document.querySelectorAll('#price_box')[i].addEventListener('dragstart', function (e){
                        e.dataTransfer.setData("카트상품", 카트상품); 
                        e.dataTransfer.setData("title", e.target.querySelector('#title').innerHTML);
                        e.dataTransfer.setData("brand", e.target.querySelector('#brand').innerHTML);
                        e.dataTransfer.setData("price", e.target.querySelector('#price').innerHTML);
                    })
                })
            })

                        document.querySelector('.drag_box').addEventListener('drop', function (e){
                                e.preventDefault();
                                
                                var data_cart = e.dataTransfer.getData("카트상품"); // 옮겨진 카트상품
                                var data_title = e.dataTransfer.getData("title");
                                var data_brand = e.dataTransfer.getData("brand");
                                var data_price = e.dataTransfer.getData("price");
                                
                                cart.title = data_title
                                cart.brand = data_brand
                                cart.price = data_price

                                var check = cartArr.some(x => x.title == cart.title);
                                var checked = cartArr.filter(x => x.title == cart.title);
                                pricebx_length = document.querySelectorAll('.price_box').length; 
                                
                                    if (check == false) { 
                                        cart.number1 = 1;
                                        cartArr.push(cart);
                                        document.querySelector('.drag_box').insertAdjacentHTML('beforeend', data_cart)
                                        document.querySelector('.result_box').style.display = 'block';
                                        $('.drag_info').html('');
                                        cart = {};
                                    } else if (check == true) {
                                        checked[0].number1 ++;
                                        cart = {};
                                    } 

                        cartArr.forEach((abc, i) => { 
                        // console.log('상품명:'+abc.title+' 갯수:'+abc.number1 +'가격:'+abc.price)
                        $('.price_box_incart').eq(i).children('#input_count').val(abc.number1);
                        })

                        var final_sum = cartArr.map(function(x){ return x.price * x.number1 }).reduce(function(a, b){ return a + b; }); 
                        $('#result_value').html(`<span>${final_sum}</span>`);
                        cartArr_sum = final_sum
        })


    function filter(){ // 한글 검색기
        
        var value, titleAll, pricebx;

        pricebx = document.querySelectorAll('#price_box'); // 상품 박스
        titleAll = document.querySelectorAll('#title'); // 상품 타이틀 전부 선택
        value = document.querySelector('#search').value; // 검색어
        pricebx_length = document.querySelectorAll('#price_box').length; // 상품 개수
        
        var title_nospace = []; // 띠어쓰기 없어도 검색 되게 하는 코드.
        for(i = 0; i < pricebx_length; i++){ // 각 타이틀의 띄어쓰기 없는 새로운 배열을 만들어 실제로 띄어쓰기를 안해도 검색이 된다.
            title_nospace[i] = $(titleAll).eq(i).text().replace(/ /gi, ''); // 장점: 실제 상품은 띄어쓰기가 있지만 검색은 대충해도 나온다.
        } 

        var set = value.replace(/ /gi, ''); // 검색 밸류값의 공백을 없애서 실제로 공백이 많은 검색이여도 검색이 가능하다. 예) 원목   침대 프레임 결과)원목침대프레임
        
        for(i = 0; i < pricebx_length; i++){ // 상품박스 출력하기.
            if (title_nospace[i].includes(set)){ 
                pricebx[i].style.display = "block";
            } else {
                pricebx[i].style.display = "none";
            }
        }

        for(i = 0; i < pricebx_length; i++){ // 검색어 밸류값과 상품박스 타이틀이 같으면 노란색 배경으로 변경하기.
                titleAll.forEach(() => {
                    var regex = new RegExp(value, 'gi');
                    if (value == ' '){
                        $(titleAll[i]).html($(titleAll[i]).text().replace(regex, value));
                        console.log(regex)
                    } else {
                        $(titleAll[i]).html($(titleAll[i]).text().replace(regex, "<span style=background-color:yellow>" + value + "</span>"));
                    }
                })
            }
            }

            function numbering(){ // 장바구니 상품에 있는 인풋 숫자 변경하면 실행되는 코드.
                cartArr.forEach((a, i) => {
                    a.number1 = document.querySelectorAll('#input_count')[i].value;
                    // console.log(cartArr)
                    var final_sum = cartArr.map((x) => { return x.price * x.number1 }).reduce((a, b) => { return a + b; }); 
                    $('#result_value').html(`<span>${final_sum}</span>`);
                    cartArr_sum = final_sum
                })
            }


            var black = document.querySelector('.black');
            
            document.querySelector('.end_buy').addEventListener('click', function(){
                black.classList.add('show-modal');
            })

            document.querySelector('.black').addEventListener('click', function(e){
                if(black == e.target){
                    black.classList.remove('show-modal')
                }
            })

            document.querySelector('#fin_btn').addEventListener('click', function(){
                black.classList.remove('show-modal')
                document.querySelector('.black01').classList.add('show-modal');
                console.log('입력완료')

                                // 시간 구하는 함수

                                let today = new Date();
                                
                                let year = today.getFullYear();  // 년도 getFullYear()
                                let month = today.getMonth() + 1 // 월 getMonth() (0~11로 1월이 0으로 표현되기 때문에 + 1을 해주어야 원하는 월을 구할 수 있다.)
                                let date = today.getDate(); // // 일 getDate()
                                
                                // console.log(year + '-' + month + '-' + date);
                                
                                let hours = today.getHours(); // 시 getHours()
                                let minutes = today.getMinutes(); // 분 getMinutes()
                                let seconds = today.getSeconds(); /// 초 getSeconds()
                                
                                // console.log(hours + ' : ' + minutes + ' : ' + seconds);
                                                                
                                var canvas = document.querySelector('.canvas'); 
                                var c = canvas.getContext('2d');
                                var x = 30;
                                var lineheight = 150;

                                        c.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 삭제하는 코드. 미리 삭제하지 않으면 다음 내용이 계속 추가되면서 값이 곂친다.
                                        c.font = '17px dotum';
                                        c.fillText('영수증', 30, 20);
                                        c.fillText(year + '-' + month + '-' + date +'  '+ hours + ':' + minutes + ':' + seconds, 30, 50); 
    
                                        cartArr.forEach((a,i) => {

                                            c.fillText(cartArr[i].title, x, 80 + (i*lineheight)) // forEach로 생성되는 배열들이 같은 장소에만 생성이 되는 버그 발생. y좌표에 변수를 하나 만들어 i와 곱하여 y좌표에 더해주면 올바르게 출력된다.
                                            c.fillText(cartArr[i].brand, x, 110 + (i*lineheight))
                                            c.fillText('가격 : ' + cartArr[i].price, x, 140 + (i*lineheight))
                                            c.fillText('수량 : ' + cartArr[i].number1, x, 170 + (i*lineheight))
                                            c.fillText('총 합계 : ' + cartArr_sum, x, 770)
                                        })

            })

            document.querySelector('#close_btn').addEventListener('click', function(){
                black.classList.remove('show-modal')
                
            })

            //영수증창 닫기 버튼 / 검은화면 클릭 닫기

            document.querySelector('#receipt_close_btn').addEventListener('click', function(){
                document.querySelector('.black01').classList.remove('show-modal')
                
            })

            var black01 = document.querySelector('.black01');

            document.querySelector('.black01').addEventListener('click', function(e){
                if(black01 == e.target){
                    black01.classList.remove('show-modal')
                }
            })

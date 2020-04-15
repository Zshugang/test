let waterfallLayout = (function waterfallLayout() {
    let columns = Array.from(document.querySelectorAll('.column')),
        _data = [];
    //获取数据
    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'json/data.json', false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _data = JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);
    }
    //绑定数据
    let bindHTML = function bindHTML() {
        _data.map(item => {
            let h = item.height,
                w = item.width;
            h = h / (w / 270);
            item.height = h;
            item.width = 270
            return item;
        })
        for (let i = 0; i < _data.length; i += 3) {
            let group = _data.slice(i, i + 3);
            group.sort((a, b) => {
                return a.height - b.height
            })
            columns.sort((a, b) => {
                return b.offsetHeight - a.offsetHeight
            })
            group.forEach((item, index) => {
                let {
                    pic,
                    link,
                    title,
                    height
                } = item;
              
                let card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<a href="${link}">
                    <div class="lazyImageBox" style="height: ${height};">
                        <img src="" alt="" data-image="${pic}">
                    </div>
                    <p>${title}</p>
                </a>`;
                columns[index].appendChild(card);
            })
        }
    }
    //延迟加载
    let lazyFunc = function lazyFunc() {
        let lazyImageBoxs = document.querySelectorAll('.lazyImageBox');
        [].forEach.call(lazyImageBoxs, lazyImageBox => {
            let load = lazyImageBox.getAttribute('data-load');
            // console.log(load);
            if (load === 'true') return;
          
            let B = utils.offset(lazyImageBox).top+lazyImageBox.offsetHeight / 2,

                A = document.documentElement.scrollTop + document.documentElement.clientHeight;
            console.log(B);
            if (B <= A) {
                lazyImage(lazyImageBox);
            }
        })
    }
    //单张加载图片
    let lazyImage = function lazyImage(lazyImageBox) {
        let img = lazyImageBox.querySelector('img'),
            imgSrc = img.getAttribute('data-image'),
            tempImg = new Image;
            console.log(imgSrc);
        tempImg.src = imgSrc;
        tempImg.onload = () => {
            img.src = imgSrc;
            utils.css(img, 'opacity', 1)
        }
        tempImg = null;
        img.removeAttribute('data-image');
        lazyImageBox.setAttribute('data-load', 'true')

    }
    //
    let render;
    let loadMore = function loadMore() {
        let HTML = document.documentElement;
        if (HTML.clientHeight * 1.5 + HTML.scrollTop > HTML.scrollHeight) {
            if (render) return;
            render = true;
            queryData();
            bindHTML();
            lazyFunc();
            render = false;
        }
    }

    return {
        init() {
            queryData();
            bindHTML();
            lazyFunc();
            window.onscroll = function () {
                lazyFunc();
                loadMore();
            }
        }
    }

})();
waterfallLayout.init();
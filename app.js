import { createSSRApp } from "vue";

const getData = async () => {
    const imgs = [];
    for (let i = 0; i < 3; i++) {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');// 一个公开的API接口，调用获取一张随机图片的地址
        if (res.ok) {
            const data = await res.json();
            imgs.push(data.message);
        }
    }
    return imgs;
}

// 一个图片列表的组件
export function createApp() {
    const component = {
        data: () => ({ imgs: [] }),
        template: `
        <div>
            <h1>Hello, Dog</h1>
            <div v-for="img in imgs" :key="img">
                <img :src="img" alt="Random Dog">
            </div>
        </div>`,
        //自定义一个asyncData方法，用户服务端渲染的时候，提前获取数据
        //我们会在服务端调用这个方法，然后挂载到window.__INITIAL_DATA__上，然后在客户端渲染的时候，会将这个数据挂载到vue实例的data上
        asyncData: getData,
        async mounted() {
            // 如果已经有数据，直接从window.__INITIAL_DATA__上获取数据
            if (window.__INITIAL_DATA__) {
                this.imgs = window.__INITIAL_DATA__;
                window.__INITIAL_DATA__ = undefined;
                return;
            } else {
                // 如果没有数据，就调用asyncData方法，获取数据
                this.imgs = await this.asyncData();
            }
        }
    }

    return createSSRApp(component);
}

// 一个计数的组件
// export function createApp() {
//     return createSSRApp({
//         data:() => ({ count: 1 }),
//         template: `<button @click="count++">{{count}}</button>`,
//         asyncData: async () => {
//             // 模拟获取远程接口的数据
//             const data = await getData();
//             return data;
//         }
//     });
// }
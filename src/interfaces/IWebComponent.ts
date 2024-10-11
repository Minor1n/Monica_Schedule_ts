export default interface IWebComponent {
    url: string;
    handler: Function;
    method:'get'|'post'|'put';
}
import Quill from 'quill';
const BlockEmbed = Quill.import('blots/block/embed');

class TwitterBlot extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('contenteditable', false);
    const innerHtml = `
      <blockquote class="twitter-tweet">
        <a href="${value}"></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `;
    node.innerHTML = innerHtml;
    return node;
  }

  static value(node) {
    return node.querySelector('a').getAttribute('href');
  }
}

TwitterBlot.blotName = 'twitter';
TwitterBlot.className = 'ql-twitter';
TwitterBlot.tagName = 'div';

Quill.register(TwitterBlot);

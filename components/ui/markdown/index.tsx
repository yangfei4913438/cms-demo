import ReactMarkdown from 'react-markdown';
import MDPre from 'components/ui/markdown/pre';
import MDVideo from 'components/ui/markdown/video';
import MDImage from 'components/ui/markdown/image';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import React, { FC } from 'react';
import cx from 'classnames';

interface MarkdownProps {
  className?: string;
  content: string;
}

const Markdown: FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={cx('prose prose-lg max-w-lg lg:col-span-10 lg:max-w-none ', className)}>
      <article className="markdown-area">
        <ReactMarkdown
          components={{
            table: ({ node, ...props }: any) => {
              return <table {...props} className={cx(props.className, 'not-prose table-auto')} />;
            },
            pre: ({ node, ...props }: any) => {
              if (node.children.length > 1) {
                return (
                  <>
                    <MDPre className={props.className} iconCLassName="text-white">
                      {props.children}
                    </MDPre>
                    <>{props.children}</>
                  </>
                );
              }
              return (
                <MDPre className={props.className} iconCLassName="text-white">
                  {props.children}
                </MDPre>
              );
            },
            video: ({ node, ...props }: any) => {
              if (node.children.length > 1) {
                return (
                  <>
                    <MDVideo {...props} />
                    <>{props.children}</>
                  </>
                );
              }
              return <MDVideo {...props} />;
            },
            img: ({ node, ...props }: any) => {
              if (node.children.length > 1) {
                return (
                  <>
                    <MDImage {...props} />
                    <>{props.children}</>
                  </>
                );
              }
              return <MDImage {...props} />;
            },
          }}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default Markdown;

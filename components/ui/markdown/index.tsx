import ReactMarkdown from 'react-markdown';
import MDPre from 'components/ui/markdown/pre';
import MDVideo from 'components/ui/markdown/video';
import MDImage from 'components/ui/markdown/image';
import Echart from 'components/ui/markdown/echarts/Echart';
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
            pre: ({ node, children, ...props }: any) => {
              if (node.children.length === 1) {
                if (node.children[0].properties.className.includes('language-echarts')) {
                  try {
                    const option = JSON.parse(node.children[0].children[0].value);
                    return <Echart echartOptions={option} />;
                  } catch (e: any) {
                    return (
                      <>
                        <p className="-mb-6">
                          <strong className="mr-1">Echarts Option Error:</strong>
                          <code className="text-red-500">{e?.message}</code>
                        </p>
                        <MDPre className="mt-0" iconCLassName="text-white">
                          <code className="hljs language-js">{node.children[0].children[0].value}</code>
                        </MDPre>
                      </>
                    );
                  }
                }
              }
              if (node.children.length > 1) {
                return (
                  <>
                    <MDPre {...props} iconCLassName="text-white" />
                    <>{children}</>
                  </>
                );
              }
              return (
                <MDPre {...props} iconCLassName="text-white">
                  {children}
                </MDPre>
              );
            },
            video: ({ node, children, ...props }: any) => {
              if (node.children.length > 1) {
                return (
                  <>
                    <MDVideo {...props} />
                    <>{children}</>
                  </>
                );
              }
              return <MDVideo {...props} />;
            },
            img: ({ node, children, ...props }: any) => {
              if (node.children.length > 1) {
                return (
                  <>
                    <MDImage {...props} />
                    <>{children}</>
                  </>
                );
              }
              return <MDImage {...props} />;
            },
          }}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeKatex, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default Markdown;

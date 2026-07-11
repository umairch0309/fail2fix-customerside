"use client";

import type {
  DefaultNodeTypes,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import type { LexicalContent } from "@/types/blog";
import { BLOG_CMS_URL } from "@/lib/constants";

interface RichTextProps {
  content: LexicalContent;
  className?: string;
}

type NodeTypes = DefaultNodeTypes;

// Custom upload converter that uses the CMS URL for images
const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode;
}> = ({ node }) => {
  // Only handle media uploads
  if (node.relationTo !== "media") {
    return null;
  }

  const uploadDoc = node.value;

  if (typeof uploadDoc !== "object" || !uploadDoc) {
    return null;
  }

  const { alt, height, url, width } = uploadDoc as {
    alt?: string;
    height?: number;
    url?: string;
    width?: number;
  };

  if (!url) {
    return null;
  }

  // Prepend CMS URL if the URL is relative
  const imageUrl = url.startsWith("http") ? url : `${BLOG_CMS_URL}${url}`;

  return (
    <figure className="my-6">
      <Image
        alt={alt || ""}
        height={height || 600}
        width={width || 800}
        src={imageUrl}
        className="rounded-lg w-full h-auto"
      />
    </figure>
  );
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />;
  },
});

export function RichText({ content, className }: RichTextProps) {
  if (!content?.root?.children?.length) {
    return null;
  }

  return (
    <div className={className}>
      <PayloadRichText
        converters={jsxConverters}
        data={content as SerializedEditorState}
      />
    </div>
  );
}

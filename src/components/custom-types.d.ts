import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = {
  type:
    | "paragraph"
    | "heading-one"
    | "list-item"
    | "numbered-list"
    | "bulleted-list";
  children: CustomText[];
};
type CustomText = { text: string; bold?: true; italic?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

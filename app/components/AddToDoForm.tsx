"use client"

import { addToDo } from "@/actions/actions";
import { useRef } from "react";
import { Form, FormControlProps } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function AddToDoForm() {
  const formRef = useRef(null);  

  const submitHandler = async (form: FormData) => {

    if (formRef.current && form.get("title") === '') {
      (formRef.current as HTMLElement).focus();
      (formRef.current as HTMLElement).classList.add('is-invalid');
      return;
    }

    await addToDo(form);
    if (formRef.current) {
      (formRef.current as FormControlProps).value = '';
      (formRef.current as HTMLElement).classList.remove('is-invalid');
      (formRef.current as HTMLElement).focus();
    }
  };

   const changeHandler = () => {
    if (!formRef.current) return;

    return ((formRef.current as FormControlProps).value !== '') ?
    (formRef.current as HTMLElement).classList.remove('is-invalid'):
    (formRef.current as HTMLElement).classList.add('is-invalid');
   }
  return <Form action={submitHandler}>
    <Form.Group className="flex">
    <Form.Control 
      ref={formRef}
      onChange={changeHandler}
      type="text" 
      name="title" 
      placeholder="Add a to do..." 
      className="w-90"/>
    <Button 
      variant="primary" 
      type="submit"
      className="w-10"
      title="Create to do">
      +
    </Button>
    </Form.Group>
  </Form>
}
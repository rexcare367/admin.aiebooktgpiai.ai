/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
// import Switch from "@mui/material/Switch";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
// import SoftSelect from "components/SoftSelect";
// import SoftDatePicker from "components/SoftDatePicker";
// import SoftEditor from "components/SoftEditor";
import SoftButton from "components/SoftButton";
import SoftAlert from "components/SoftAlert";

// AI EBOOK DASHBOARD React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// router
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import axios from "axios";

// Dropzone components
import Dropzone from "dropzone";

// Dropzone styles
import "dropzone/dist/dropzone.css";

// Custom styles for the SoftDropzone
import SoftDropzoneRoot from "components/SoftDropzone/SoftDropzoneRoot";

// ----------------------------------------------------------------------

export const NewBookSchema = zod.object({
    title: zod.string().min(1, { message: 'Title is required!' }),
  });

function NewEbook() {
  const [fileUrl, setFileUrl] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const dropzoneRef = useRef();

  useEffect(() => {
    Dropzone.autoDiscover = false;

    function createDropzone() {
      return new Dropzone(dropzoneRef.current, { 
        init: function() {
          this.on("sending", function() {
            // Handle the loading state here
            console.log("File is being uploaded...");
            setIsUploading(true)
          });
          this.on("success", function(file, response) {
            // Handle the response from the server here
            console.log("File uploaded successfully:", response);
            setFileUrl(response.file_url);
            setFileKey(response.file_key);
            setIsUploading(false);
          });
          this.on("error", function() {
            // Handle the loading state here
            console.error("An error occurred during file upload.");
            setIsUploading(false);
          });
        }
       });
    }

    function removeDropzone() {
      if (Dropzone.instances.length > 0) Dropzone.instances.forEach((dz) => dz.destroy());
    }

    createDropzone();

    return () => removeDropzone();
  }, []);

  const defaultValues = {
    title: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewBookSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('field', data, fileUrl);

      await axios.post(`${process.env.REACT_APP_API_URL}ebooks/add`, {
        title: data.title,
        fileUrl,
        fileKey
      }).then(res=>{
        console.log(res);
        reset();
        setFileUrl('');
        setShowAlert(true);
        if (dropzoneRef.current) {
          dropzoneRef.current.dropzone.removeAllFiles(); // Clear the dropzone
        }
        setTimeout(() => {
          window.location.href = '/pages/ebook/list';
        }, 3000);
      }
    ).catch(err=>console.log(err));

    } catch (error) {
      console.error(error);
      // setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const [showAlert, setShowAlert] = useState(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={3} mb={4}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={9}>
            <Card sx={{ overflow: "visible" }}>
              {showAlert && <SoftAlert color="info">Indexing is started!</SoftAlert>}

              <FormProvider {...methods}>
                <form onSubmit={onSubmit} noValidate autoComplete="off">
                  <SoftBox p={2} lineHeight={1}>
                    <SoftTypography variant="h6" fontWeight="medium">
                      New Ebook
                    </SoftTypography>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Upload new ebook
                    </SoftTypography>
                    <Divider />
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        Ebook Title
                      </SoftTypography>
                    </SoftBox>
                    
                    <Controller
                      name="title"
                      render={({ field, fieldState: { error } }) => (
                          <SoftInput {...field} placeholder="EBOOK Title"  />
                      )}
                    />
                    </SoftBox>

                    <SoftBox>
                    <SoftBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                    >
                        <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Attach Files
                        </SoftTypography>
                        </SoftBox>
                        
                        <SoftDropzoneRoot
                          component="form"
                          action={`${process.env.REACT_APP_API_URL}ebooks/upload-book`}
                          ref={dropzoneRef}
                          className="form-control dropzone"
                        >
                          <SoftBox className="fallback">
                            <SoftBox component="input" name="file" type="file" />
                          </SoftBox>
                        </SoftDropzoneRoot>
                    </SoftBox>
                    </SoftBox>
                    <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                    <SoftBox mr={1}>
                        <SoftButton color="light" onClick={()=>reset()}>cancel</SoftButton>
                    </SoftBox>
                    <SoftButton variant="gradient" color="info" type="submit" disabled={isUploading || isSubmitting || (fileUrl === '' || fileKey === '')}>
                        {isUploading ? "Uploading File" : isSubmitting ? "Indexing File" : "Start Indexing"}
                    </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </form>
              </FormProvider>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewEbook;

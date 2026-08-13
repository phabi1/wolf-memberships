<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\AbstractController;
use WP_REST_Request;

class UploadController extends AbstractController
{
    public function uploadAction(WP_REST_Request $request)
    {
        $files = $request->get_file_params();

        if (empty($files['file'])) {
            return new \WP_Error('missing_file', 'No file uploaded', ['status' => 400]);
        }

        $uploadedFile = $files['file'];

        $maxFileSize = 5 * 1024 * 1024; // 5 MB
        if ($uploadedFile['size'] > $maxFileSize) {
            return new \WP_Error('file_too_large', 'The uploaded file exceeds the maximum allowed size of 5 MB.', ['status' => 400]);
        }

        $allowedMimeTypes = [
            'jpg|jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'pdf' => 'application/pdf',
        ];

        $upload_override = [
            'test_form' => false, // Disable form validation
            'test_type' => true, // Enable MIME type checking
            'mimes' => $allowedMimeTypes,
        ];

        if (!function_exists('wp_handle_upload')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        add_filter('upload_dir', [$this, 'modifyUploadDir']);
        $movedFile = wp_handle_upload($uploadedFile, $upload_override);
        remove_filter('upload_dir', [$this, 'modifyUploadDir']);

        if ($movedFile === false || isset($movedFile['error'])) {
            $errorMessage = isset($movedFile['error']) ? $movedFile['error'] : 'Unknown error occurred during file upload.';
            return new \WP_Error('upload_error', $errorMessage, ['status' => 500]);
        }

        // Example response
        return [
            'success' => true,
            'message' => 'File uploaded successfully.',
            'file_url' => $movedFile['url'],
            'type' => $movedFile['type'],
        ];
    }

    private function modifyUploadDir($dir)
    {
        $customDir = '/membership'; // Change this to your desired directory

        $dir['path'] = $dir['basedir'] . $customDir;
        $dir['url'] = $dir['baseurl'] . $customDir;
        $dir['subdir'] = $customDir;
        
        return $dir;
    }
}
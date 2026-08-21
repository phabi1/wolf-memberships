<?php
    $logoUrl = '';
    $siteName = get_bloginfo('name');
    if (function_exists('get_custom_logo') && get_theme_mod('custom_logo')) {
        $logoUrl = wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full');
    }
    if (empty($logoUrl) && function_exists('get_site_icon_url')) {
        $logoUrl = get_site_icon_url();
    }
?>
<html>
    <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #1f2937;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f7fb; margin: 0; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td style="padding: 0 0 12px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: transparent; border-radius: 0; box-shadow: none;">
                                    <tr>
                                        <td style="padding: 0 24px 10px;">
                                            <?php if (!empty($logoUrl)) : ?>
                                                <img src="<?php echo esc_url($logoUrl); ?>" alt="<?php echo esc_attr($siteName); ?>" style="display: block; max-height: 42px; width: auto; margin: 0 0 10px; border: 0; outline: none; text-decoration: none;" />
                                            <?php endif; ?>
                                            <div style="font-size: 22px; line-height: 1.3; font-weight: bold; color: #2c2c2c; letter-spacing: 0.3px;">
                                                <?php echo esc_html($siteName); ?>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #2c2c2c 0%, #9e1c1c 100%); padding: 28px 32px 20px; text-align: center;">
                                <div style="font-size: 30px; line-height: 1.2; font-weight: bold; color: #ffffff;">Nouvelle demande</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 36px 32px 24px 32px;">
                                <p style="margin: 0 0 18px; font-size: 18px; line-height: 1.6; color: #1f2937;">
                                    Une nouvelle demande a été soumise pour la campagne <strong>"<?php echo $campaignName; ?>"</strong>.
                                </p>

                                <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #475569;">
                                    <strong>Membre :</strong> <?php echo $memberName; ?> (<?php echo $memberEmail; ?>)<br>
                                    <strong>ID de la demande :</strong> <?php echo $requestId; ?>
                                </p>

                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px auto;">
                                    <tr>
                                        <td align="center" bgcolor="#9e1c1c" style="border-radius: 10px;">
                                            <a href="<?php echo $adminUrl; ?>" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 10px;">
                                                Voir la demande
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                                    Si le bouton ne fonctionne pas, utilisez ce lien :
                                </p>
                                <p style="margin: 12px 0 0; font-size: 14px; line-height: 1.6; word-break: break-all; color: #2563eb;">
                                    <a href="<?php echo $adminUrl; ?>" style="color: #9e1c1c; text-decoration: none;">
                                        <?php echo $adminUrl; ?>
                                    </a>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 32px 32px;">
                                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; line-height: 1.6; color: #64748b; text-align: center;">
                                    Administration<br>
                                    Merci de traiter cette demande rapidement.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>

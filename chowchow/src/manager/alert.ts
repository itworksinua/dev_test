import { Alert } from "react-native"
import { localize } from "../locale"

/**
 * Confirm a user wants to use Touch/Face ID in the future
 * @param onConfirm
 * @param onCancel
 */
export function confirmTouchId(onConfirm: () => void, onCancel: () => void): void {
  Alert.alert(
    localize(`confirm:touchid:title`),
    localize(`confirm:touchid:subtitle`),
    [
      {
        text: localize(`alert:button:ok`),
        onPress: onConfirm,
      },
      {
        text: localize(`alert:button:cancel`),
        onPress: onCancel,
        style: `cancel`,
      },
    ],
  )
}

/**
 * Alert a user when a download failed
 */
export function alertDownloadOnCellularDisabled(): void {

  Alert.alert(
    localize(`alert:download_cellular_disabled:title`),
    localize(`alert:download_cellular_disabled:subtitle`),
    [
      {
        text: localize(`alert:button:ok`),
      },
    ],
  )
}

/**
 * Alert a user when a download failed
 */
export function alertNoNetworkConnection(): void {

  Alert.alert(
    localize(`alert:no_network_connection:title`),
    localize(`alert:no_network_connection:subtitle`),
    [
      {
        text: localize(`alert:button:ok`),
      },
    ],
  )
}

/**
 * Alert a user when a download failed
 */
export function alertDownloadError(msg): void {

  const message = msg || localize(`alert:download_error:subtitle`)

  Alert.alert(
    localize(`alert:download_error:title`),
    message,
    [
      {
        text: localize(`alert:button:ok`),
      },
    ],
  )
}

/**
 * Confirm you are going to delete all the downloads
 * @param onConfirm 
 * @param onCancel 
 */
export function confirmDeleteAll(onConfirm: () => void, onCancel: () => void): void {
  Alert.alert(
    localize(`confirm:delete_all:title`),
    localize(`confirm:delete_all:subtitle`),
    [
      {
        text: localize(`alert:button:ok`),
        onPress: onConfirm,
      },
      {
        text: localize(`alert:button:cancel`),
        onPress: onCancel,
        style: `cancel`,
      },
    ],
  )
}

export function confirmResumeIncompleteDownloads(count, onConfirm: () => void, onCancel: () => void): void {
  Alert.alert(
    localize(`confirm:resume_all:title`,{ 
      smart_count: count 
    }),
    localize(`confirm:resume_all:subtitle`),
    [
      {
        text: localize(`alert:button:ok`),
        onPress: onConfirm,
      },
      {
        text: localize(`alert:button:cancel`),
        onPress: onCancel,
        style: `cancel`,
      },
    ],
  )
}

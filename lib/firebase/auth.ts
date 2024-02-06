import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "./index";
import UserService from "./user";

interface SignUpDto {
  email: string;
  password: string;
  username: string;
}

interface SignInDto {
  email: string;
  password: string;
}

const googleProvider = new GoogleAuthProvider();

const signUpWithEmail = async ({ email, password, username }: SignUpDto) => {
  if (!email || !password || !username) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await UserService.createUser({
      id: userCredential.user.uid,
      username,
      email,
      avatar: "",
    });

    await Promise.all([
      sendEmailVerification(userCredential.user),
      updateProfile(userCredential.user, {
        displayName: username,
      }),
    ]);

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signInWithEmail = async ({ email, password }: SignInDto) => {
  try {
    if (!email || !password) throw new Error("Missing email or password");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const additionalUserInfo = getAdditionalUserInfo(userCredential);
    if (additionalUserInfo?.isNewUser) {
      if (!userCredential.user.displayName || !userCredential.user.email)
        throw new Error("Missing username or email");
      await UserService.createUser({
        id: userCredential.user.uid,
        username: userCredential.user.displayName,
        email: userCredential.user.email,
        avatar: userCredential.user.photoURL ?? "",
      });
    }

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

const AuthService = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
};

export default AuthService;
